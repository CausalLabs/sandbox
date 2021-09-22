package io.causallabs.example;

public class SessionPlugin implements SessionPluginBase {
    @Override
    public void eval(Session session) throws Exception {
        String visitorId = session.getVisitorId();
        // look up a bunch of stuff here
        session.setUserZipCode("02445");
    }
}
