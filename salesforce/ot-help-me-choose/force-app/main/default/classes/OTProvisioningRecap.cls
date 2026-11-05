/**
 * "Send Provisioning Owner a recap email": the hand-off from onboarding to the
 * provisioning team. Emails the provisioning order's Provisioning Owner
 * everything the onboarding assistant captured, with links to the record and
 * the conversation, and logs it on the provisioning order's activity timeline.
 *
 * Called from the screen flow OT_Send_Provisioning_Recap (quick action on the
 * provisioning order). Demo safety as OTWelcomeEmail: it only goes to
 * amaury@limio.com or a +alias of it.
 */
public without sharing class OTProvisioningRecap {

    public class Request {
        @InvocableVariable(label='Provisioning order Id' required=true)
        public Id orderId;
    }

    public class Result {
        @InvocableVariable(label='Message')
        public String message;
    }

    @InvocableMethod(label='Send Provisioning Owner a recap email' description='Emails the Provisioning Owner the onboarding details of this provisioning order')
    public static List<Result> send(List<Request> requests) {
        List<Result> out = new List<Result>();
        for (Request r : requests) {
            Result res = new Result();
            try {
                res.message = sendOne(r.orderId);
            } catch (Exception e) {
                res.message = 'The recap could not be sent: ' + e.getMessage();
            }
            out.add(res);
        }
        return out;
    }

    public static final String SUBJECT_PREFIX = 'Ready to provision: ';

    @TestVisible
    static String sendOne(Id orderId) {
        i42as__ioProvisioningOrder__c p = [
            SELECT Id, Name, i42as__OrderReference__c, OT_Customer_Email__c, OT_Product__c, OT_ERP__c, OT_ERP_Version__c,
                   OT_Connection_Method__c, OT_EDI_ID__c, OT_Admin_Users__c, OT_Region__c, OT_Data_Centre__c,
                   OT_Go_Live_Target__c, OT_Onboarding_Status__c, OT_Onboarding_Summary__c, OT_Conversation_Id__c,
                   OT_Account__r.Name, OT_Opportunity__r.Name,
                   OT_Provisioning_Owner__c, OT_Provisioning_Owner__r.FirstName, OT_Provisioning_Owner__r.Name, OT_Provisioning_Owner__r.Email
            FROM i42as__ioProvisioningOrder__c WHERE Id = :orderId
        ];
        if (p.OT_Provisioning_Owner__c == null) {
            return 'Set a Provisioning Owner first, then send the recap.';
        }
        String to = OTWelcomeEmail.safeRecipient(p.OT_Provisioning_Owner__r.Email);
        String customer = p.OT_Account__r != null && String.isNotBlank(p.OT_Account__r.Name) ? p.OT_Account__r.Name : p.OT_Customer_Email__c;
        String subject = (SUBJECT_PREFIX + customer + ' (' + p.i42as__OrderReference__c + ')').left(255);

        Messaging.SingleEmailMessage m = new Messaging.SingleEmailMessage();
        m.setToAddresses(new List<String>{ to });
        m.setSubject(subject);
        m.setHtmlBody(html(p, customer));
        m.setPlainTextBody(text(p, customer));
        m.setSenderDisplayName('OpenText Business Network');
        m.setSaveAsActivity(false);
        List<Messaging.SendEmailResult> results = Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ m }, false);
        if (!results[0].isSuccess()) {
            return 'The recap could not be sent: ' + results[0].getErrors()[0].getMessage();
        }

        // log it on the provisioning order's activity timeline
        insert new Task(
            WhatId = p.Id,
            Subject = ('Email: ' + subject).left(255),
            Description = text(p, customer).left(32000),
            TaskSubtype = 'Email',
            Status = 'Completed',
            Priority = 'Normal',
            ActivityDate = Date.today(),
            OwnerId = UserInfo.getUserId()
        );
        return 'Recap sent to ' + p.OT_Provisioning_Owner__r.Name + ' (' + to + '). Your provisioning team can take it from here.';
    }

    // ---------------------------------------------------------------- content

    static String esc(String s) {
        return s == null ? '' : s.escapeHtml4();
    }

    static String orDash(String s) {
        return String.isBlank(s) ? '—' : s;
    }

    // The partners line the assistant captured, from the summary it wrote
    @TestVisible
    static String partners(String summary) {
        if (summary == null) {
            return null;
        }
        for (String l : summary.split('\n')) {
            if (l.startsWith('partners_confirmed:')) {
                return l.substringAfter(':').trim();
            }
        }
        return null;
    }

    static String recordUrl(Id id) {
        return URL.getOrgDomainUrl().toExternalForm() + '/' + id;
    }

    // The conversation link Limio sent with the capture (last line of the summary)
    static String conversationUrl(i42as__ioProvisioningOrder__c p) {
        String summary = p.OT_Onboarding_Summary__c;
        if (summary == null || !summary.contains('Conversation: http')) {
            return null;
        }
        return summary.substringAfterLast('Conversation: ').trim().split('\\s')[0];
    }

    static List<List<String>> rows(i42as__ioProvisioningOrder__c p, String customer) {
        String erp = String.isBlank(p.OT_ERP__c) || p.OT_ERP__c.startsWith('n/a') ? 'None (web portal)'
            : (String.isBlank(p.OT_ERP_Version__c) ? p.OT_ERP__c : p.OT_ERP__c + ' ' + p.OT_ERP_Version__c);
        return new List<List<String>>{
            new List<String>{ 'Customer', orDash(customer) },
            new List<String>{ 'Contact', orDash(p.OT_Customer_Email__c) },
            new List<String>{ 'Order', orDash(p.i42as__OrderReference__c) + ' · ' + orDash(p.OT_Product__c) },
            new List<String>{ 'Data centre', orDash(p.OT_Data_Centre__c) },
            new List<String>{ 'ERP', erp },
            new List<String>{ 'Connection', orDash(p.OT_Connection_Method__c) },
            new List<String>{ 'EDI ID', orDash(p.OT_EDI_ID__c) },
            new List<String>{ 'Admin users', orDash(p.OT_Admin_Users__c) },
            new List<String>{ 'Partners to onboard', orDash(partners(p.OT_Onboarding_Summary__c)) },
            new List<String>{ 'Go-live target', p.OT_Go_Live_Target__c == null ? '—' : Datetime.newInstance(p.OT_Go_Live_Target__c, Time.newInstance(12, 0, 0, 0)).format('EEE d MMM yyyy') },
            new List<String>{ 'Onboarding', orDash(p.OT_Onboarding_Status__c) }
        };
    }

    static String html(i42as__ioProvisioningOrder__c p, String customer) {
        String font = 'font-family:Inter,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;';
        String table = '';
        for (List<String> r : rows(p, customer)) {
            table += '<tr><td style="' + font + 'padding:8px 12px;border-bottom:1px solid #e7eaef;color:#6b778a;font-size:13px;white-space:nowrap;vertical-align:top;">' + esc(r[0]) + '</td>'
                   + '<td style="' + font + 'padding:8px 12px;border-bottom:1px solid #e7eaef;color:#101c2f;font-size:14px;font-weight:600;">' + esc(r[1]) + '</td></tr>';
        }
        String conv = conversationUrl(p);
        String first = String.isBlank(p.OT_Provisioning_Owner__r.FirstName) ? 'team' : p.OT_Provisioning_Owner__r.FirstName;
        return '<!doctype html><html><body style="margin:0;padding:0;background:#f6f7f7;">'
            + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f7;"><tr><td align="center" style="padding:24px 12px;">'
            + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e7eaef;border-radius:12px;">'
            + '<tr><td style="background:#0b2d8c;border-radius:12px 12px 0 0;padding:18px 28px;">'
            + '<div style="' + font + 'color:#ffffff;font-size:18px;font-weight:800;">opentext<span style="font-weight:400;color:#a9c6ff;"> &nbsp;|&nbsp; Provisioning hand-off</span></div></td></tr>'
            + '<tr><td style="padding:26px 28px;">'
            + '<p style="' + font + 'margin:0 0 6px;color:#101c2f;font-size:20px;font-weight:700;">Over to you, ' + esc(first) + '.</p>'
            + '<p style="' + font + 'margin:0 0 18px;color:#3f4d62;font-size:15px;line-height:22px;"><strong>' + esc(customer) + '</strong> has finished onboarding with the assistant. Everything you need to set them up is below.</p>'
            + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7eaef;border-radius:8px;border-collapse:separate;">' + table + '</table>'
            + '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 6px;"><tr><td style="background:#1a6aff;border-radius:50px;">'
            + '<a href="' + recordUrl(p.Id) + '" style="' + font + 'display:inline-block;padding:11px 22px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open provisioning order ' + esc(p.Name) + '</a></td></tr></table>'
            + (conv == null ? '' : '<p style="' + font + 'margin:12px 0 0;font-size:14px;"><a href="' + conv + '" style="color:#1a6aff;">Read the onboarding conversation</a></p>')
            + '</td></tr></table></td></tr></table></body></html>';
    }

    static String text(i42as__ioProvisioningOrder__c p, String customer) {
        String out = customer + ' has finished onboarding with the assistant. Everything you need to set them up:\n\n';
        for (List<String> r : rows(p, customer)) {
            out += r[0] + ': ' + r[1] + '\n';
        }
        out += '\nProvisioning order: ' + recordUrl(p.Id) + '\n';
        String conv = conversationUrl(p);
        return conv == null ? out : out + 'Conversation: ' + conv + '\n';
    }
}
