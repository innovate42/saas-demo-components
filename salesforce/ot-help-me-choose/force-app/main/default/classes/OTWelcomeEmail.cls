/**
 * The OpenText welcome + onboarding checklist email, sent the moment the
 * onboarding assistant's answers land on a provisioning order
 * (OTAgentCaptureHandler.applyOnboarding).
 *
 * - Once per provisioning order: OT_Welcome_Email_Sent__c is stamped after a
 *   successful send and orders that already carry it are skipped, so retries
 *   and re-captures never send twice.
 * - Demo safety: it only ever goes to amaury@limio.com or a +alias of it. Any
 *   other contact email is replaced by amaury@limio.com.
 * - Logged as activity on the Contact (without emailing the Contact) and on
 *   the provisioning order, where it shows in the activity timeline.
 * - A failed send never rolls back the provisioning order update.
 */
public without sharing class OTWelcomeEmail {

    public static final String SAFE_RECIPIENT = 'amaury@limio.com';
    public static final String SUBJECT = 'Welcome to the OpenText Business Network, your onboarding checklist';
    static final String ACCOUNT_URL = 'https://saas-dev-shop.prod.limio.com/ot-account';
    static final String HELP_URL = 'https://saas-dev-shop.prod.limio.com/ot-enterprise';

    // partnersByOrder: provisioning order id -> the partners the customer confirmed
    public static void send(Map<Id, String> partnersByOrder) {
        if (partnersByOrder == null || partnersByOrder.isEmpty()) {
            return;
        }
        try {
            sendNow(partnersByOrder);
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'OT welcome email failed: ' + e.getMessage() + ' ' + e.getStackTraceString());
        }
    }

    // amaury@limio.com and amaury+anything@limio.com go through; anything else
    // is redirected to amaury@limio.com.
    public static String safeRecipient(String email) {
        String e = email == null ? '' : email.trim().toLowerCase();
        return Pattern.matches('amaury(\\+[^@\\s]+)?@limio\\.com', e) ? e : SAFE_RECIPIENT;
    }

    static void sendNow(Map<Id, String> partnersByOrder) {
        List<i42as__ioProvisioningOrder__c> orders = [
            SELECT Id, Name, i42as__OrderReference__c, OT_Customer_Email__c, OT_Opportunity__c, OT_Product__c,
                   OT_ERP__c, OT_ERP_Version__c, OT_Connection_Method__c, OT_EDI_ID__c, OT_Admin_Users__c,
                   OT_Data_Centre__c, OT_Go_Live_Target__c, OT_Welcome_Email_Sent__c
            FROM i42as__ioProvisioningOrder__c
            WHERE Id IN :partnersByOrder.keySet() AND OT_Welcome_Email_Sent__c = null
            FOR UPDATE
        ];
        if (orders.isEmpty()) {
            return;
        }

        Set<String> emails = new Set<String>();
        for (i42as__ioProvisioningOrder__c p : orders) {
            if (p.OT_Customer_Email__c != null) {
                emails.add(p.OT_Customer_Email__c);
            }
        }
        Map<String, Contact> contacts = new Map<String, Contact>();
        for (Contact c : [SELECT Id, FirstName, Email FROM Contact WHERE Email IN :emails ORDER BY CreatedDate DESC]) {
            if (!contacts.containsKey(c.Email.toLowerCase())) {
                contacts.put(c.Email.toLowerCase(), c);
            }
        }

        List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage>();
        List<i42as__ioProvisioningOrder__c> sentFor = new List<i42as__ioProvisioningOrder__c>();
        for (i42as__ioProvisioningOrder__c p : orders) {
            Contact c = p.OT_Customer_Email__c == null ? null : contacts.get(p.OT_Customer_Email__c.toLowerCase());
            Messaging.SingleEmailMessage m = new Messaging.SingleEmailMessage();
            m.setToAddresses(new List<String>{ safeRecipient(p.OT_Customer_Email__c) });
            m.setSubject(SUBJECT);
            m.setHtmlBody(html(p, c, partnersByOrder.get(p.Id)));
            m.setPlainTextBody(text(p, c, partnersByOrder.get(p.Id)));
            m.setSenderDisplayName('OpenText Business Network');
            m.setReplyTo(SAFE_RECIPIENT);
            m.setSaveAsActivity(true);
            if (c != null) {
                // log on the Contact without emailing it: the recipient is the safe address above
                m.setTargetObjectId(c.Id);
                m.setTreatTargetObjectAsRecipient(false);
                m.setWhatId(p.Id);
            } else {
                // whatId needs a Contact target, so without one the email is sent but not logged
                m.setSaveAsActivity(false);
            }
            messages.add(m);
            sentFor.add(p);
        }

        List<Messaging.SendEmailResult> results = Messaging.sendEmail(messages, false);
        List<i42as__ioProvisioningOrder__c> stamped = new List<i42as__ioProvisioningOrder__c>();
        for (Integer i = 0; i < results.size(); i++) {
            if (results[i].isSuccess()) {
                stamped.add(new i42as__ioProvisioningOrder__c(Id = sentFor[i].Id, OT_Welcome_Email_Sent__c = System.now()));
            } else {
                System.debug(LoggingLevel.ERROR, 'OT welcome email not sent for ' + sentFor[i].Name + ': ' + results[i].getErrors());
            }
        }
        if (!stamped.isEmpty()) {
            update stamped;
        }
    }

    // ---------------------------------------------------------------- content

    static String esc(String s) {
        return s == null ? '' : s.escapeHtml4();
    }

    static String orBlank(String s, String fallback) {
        return String.isBlank(s) ? fallback : s;
    }

    static String goLive(i42as__ioProvisioningOrder__c p) {
        Date d = p.OT_Go_Live_Target__c != null ? p.OT_Go_Live_Target__c : Date.today().addDays(9);
        return Datetime.newInstance(d, Time.newInstance(12, 0, 0, 0)).format('EEEE d MMMM yyyy');
    }

    static String erp(i42as__ioProvisioningOrder__c p) {
        String name = String.isBlank(p.OT_ERP__c) || p.OT_ERP__c.startsWith('n/a') ? null : p.OT_ERP__c;
        if (name == null) {
            return 'None, you trade through the web portal';
        }
        return String.isBlank(p.OT_ERP_Version__c) ? name : name + ' (' + p.OT_ERP_Version__c + ')';
    }

    @TestVisible
    static List<List<String>> checklist(i42as__ioProvisioningOrder__c p, String partners) {
        return new List<List<String>>{
            new List<String>{ 'ERP', erp(p) },
            new List<String>{ 'Connection', orBlank(p.OT_Connection_Method__c, 'To confirm with your specialist') },
            new List<String>{ 'EDI ID', orBlank(p.OT_EDI_ID__c, 'To confirm with your specialist') },
            new List<String>{ 'Admin users', orBlank(p.OT_Admin_Users__c, 'You, until you invite your team') },
            new List<String>{ 'Partners to test with', orBlank(partners, 'The partners on your order') },
            new List<String>{ 'Go-live target', goLive(p) }
        };
    }

    static List<List<String>> milestones(i42as__ioProvisioningOrder__c p) {
        String dc = String.isBlank(p.OT_Data_Centre__c) ? 'your region' : 'the ' + p.OT_Data_Centre__c + ' data centre';
        String connection = String.isBlank(p.OT_Connection_Method__c)
            ? 'Your connection goes live.'
            : 'Your ' + p.OT_Connection_Method__c + ' connection goes live.';
        return new List<List<String>>{
            new List<String>{ 'Day 0', 'Your Trading Grid tenant is created in ' + dc + '.' },
            new List<String>{ 'Day 1–2', 'Admin users get their logins; your ERP adapter or portal is set up.' },
            new List<String>{ 'Day 2–4', connection },
            new List<String>{ 'Day 3–8', 'We load each partner\'s maps and exchange test documents.' },
            new List<String>{ 'Day 9', 'Go live: your first production order flows.' }
        };
    }

    static String greetingName(Contact c) {
        return c == null || String.isBlank(c.FirstName) ? 'there' : c.FirstName;
    }

    static String html(i42as__ioProvisioningOrder__c p, Contact c, String partners) {
        String font = 'font-family:Inter,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;';
        String rows = '';
        for (List<String> r : checklist(p, partners)) {
            rows += '<tr><td style="' + font + 'padding:10px 12px;border-bottom:1px solid #e7eaef;color:#6b778a;font-size:13px;white-space:nowrap;vertical-align:top;">&#9744;&nbsp; ' + esc(r[0]) + '</td>'
                  + '<td style="' + font + 'padding:10px 12px;border-bottom:1px solid #e7eaef;color:#101c2f;font-size:15px;font-weight:600;">' + esc(r[1]) + '</td></tr>';
        }
        String days = '';
        for (List<String> r : milestones(p)) {
            days += '<tr><td style="' + font + 'padding:6px 12px 6px 0;color:#1a6aff;font-size:13px;font-weight:700;white-space:nowrap;vertical-align:top;">' + esc(r[0]) + '</td>'
                  + '<td style="' + font + 'padding:6px 0;color:#3f4d62;font-size:14px;">' + esc(r[1]) + '</td></tr>';
        }
        String plan = orBlank(p.OT_Product__c, 'OpenText Business Network');
        return '<!doctype html><html><body style="margin:0;padding:0;background:#f6f7f7;">'
            + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f7;"><tr><td align="center" style="padding:24px 12px;">'
            + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e7eaef;border-radius:12px;">'
            + '<tr><td style="background:#0b2d8c;background:linear-gradient(135deg,#024cbb 11%,#000066 70%);border-radius:12px 12px 0 0;padding:22px 28px;">'
            + '<div style="' + font + 'color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.3px;">opentext<span style="font-weight:400;color:#a9c6ff;"> &nbsp;|&nbsp; Business Network</span></div></td></tr>'
            + '<tr><td style="padding:28px;">'
            + '<p style="' + font + 'margin:0 0 6px;color:#101c2f;font-size:22px;font-weight:700;">Welcome aboard, ' + esc(greetingName(c)) + '.</p>'
            + '<p style="' + font + 'margin:0 0 20px;color:#3f4d62;font-size:15px;line-height:22px;">Your order <strong>' + esc(p.i42as__OrderReference__c) + '</strong> for <strong>' + esc(plan) + '</strong> is confirmed and your setup has started. Here is your onboarding checklist, exactly as you gave it to our assistant.</p>'
            + '<p style="' + font + 'margin:0 0 8px;color:#6b778a;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Your onboarding checklist</p>'
            + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7eaef;border-radius:8px;border-collapse:separate;">' + rows + '</table>'
            + '<p style="' + font + 'margin:24px 0 8px;color:#6b778a;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Your next nine days</p>'
            + '<table role="presentation" cellpadding="0" cellspacing="0">' + days + '</table>'
            + '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 8px;"><tr><td style="background:#1a6aff;border-radius:50px;">'
            + '<a href="' + ACCOUNT_URL + '" style="' + font + 'display:inline-block;padding:12px 24px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">Manage your account</a></td></tr></table>'
            + '<p style="' + font + 'margin:18px 0 0;color:#3f4d62;font-size:14px;line-height:21px;">Something to change? Reply to this email or <a href="' + HELP_URL + '" style="color:#1a6aff;">talk to a Business Network specialist</a>.</p>'
            + '</td></tr>'
            + '<tr><td style="' + font + 'padding:16px 28px;border-top:1px solid #e7eaef;color:#8a94a3;font-size:12px;">OpenText Business Network · Order ' + esc(p.i42as__OrderReference__c) + ' · Provisioning ' + esc(p.Name) + '</td></tr>'
            + '</table></td></tr></table></body></html>';
    }

    static String text(i42as__ioProvisioningOrder__c p, Contact c, String partners) {
        String out = 'Welcome aboard, ' + greetingName(c) + '.\n\nYour order ' + p.i42as__OrderReference__c + ' for '
            + orBlank(p.OT_Product__c, 'OpenText Business Network') + ' is confirmed and your setup has started.\n\nYOUR ONBOARDING CHECKLIST\n';
        for (List<String> r : checklist(p, partners)) {
            out += '[ ] ' + r[0] + ': ' + r[1] + '\n';
        }
        out += '\nYOUR NEXT NINE DAYS\n';
        for (List<String> r : milestones(p)) {
            out += r[0] + ': ' + r[1] + '\n';
        }
        return out + '\nManage your account: ' + ACCOUNT_URL + '\nSomething to change? Reply to this email or visit ' + HELP_URL + '\n';
    }
}
