package io.causallabs.example;

import io.causallabs.runtime.Impression;
import io.causallabs.runtime.ImpressionEvent;
import io.causallabs.runtime.VariantValue;
import java.util.List;
import java.util.UUID;

public class SessionPlugin implements SessionPluginBase {
  public SessionPlugin() {
    System.out.println("Started");
  }

  @Override
  public void fill(Session session) throws Exception {
    String visitorId = session.getVisitorId();
    // look up a bunch of stuff here
    session.setUserZipCode("02445");
  }

  @Override
  public void newVariant(
      Session session,
      String experimentName,
      UUID experimentId,
      String variantName,
      UUID variantId,
      List<VariantValue> values) {
    System.out.println("Chose variant " + variantName + " for experiment " + experimentName);
  }

  @Override
  public void fill(Session session, Impression impression) {
    if (impression instanceof Simple) {
      Simple simple = (Simple) impression;
      // use the eval method to populate the plugin output values
      simple.setSimplePluginOutput(simple.getSimpleInput() + 1);
    }
  }

  @Override
  public void onImpression(Session session, Impression impression) throws Exception {
    if (impression instanceof Simple) {
      Simple simple = (Simple) impression;
      // use the register method to tell other data systems that an impression has occured
      // all values are available because you are guaranteed that eval has previously been
      // called
      System.out.println(
          "Simple impression input:"
              + simple.getSimpleInput()
              + " plugin:"
              + simple.getSimplePluginOutput()
              + " output:"
              + simple.getSimpleOutput());
    }
  }

  @Override
  public void onEvent(Session session, Impression impression, ImpressionEvent event) {
    if (event instanceof Simple.Click) {
      Simple.Click click = (Simple.Click) event;
      System.out.println("Simple click with value: " + click.getClickValue());
    }
  }
}
