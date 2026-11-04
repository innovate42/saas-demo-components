/**
 * Schedules OTHelpMeChooseSync. Apex cron runs at most hourly per job, so
 * scheduleEveryFiveMinutes() registers twelve jobs, one per five-minute slot.
 */
public without sharing class OTHelpMeChooseSyncSchedule implements Schedulable {

    public void execute(SchedulableContext ctx) {
        System.enqueueJob(new OTHelpMeChooseSync());
    }

    public static void scheduleEveryFiveMinutes() {
        for (Integer minute = 0; minute < 60; minute += 5) {
            System.schedule('OT help me choose sync :' + String.valueOf(minute).leftPad(2, '0'),
                '0 ' + minute + ' * * * ?', new OTHelpMeChooseSyncSchedule());
        }
    }
}
