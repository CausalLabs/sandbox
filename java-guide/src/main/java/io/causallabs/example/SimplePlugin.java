package io.causallabs.example;

public class SimplePlugin implements SimplePluginBase {

  @Override
  public void fill(Session session, Simple simple) throws Exception {
    // use the eval method to populate the plugin output values
    simple.setSimpleOutput(simple.getSimpleInput() + 1);
  }

  @Override
  public void onImpression(Session session, Simple simple) throws Exception {
    // use the register method to tell other data systems that an impression has occured
    // all values are available because you are guaranteed that eval has previously been called
    System.out.println(
        "Simple impression input:"
            + simple.getSimpleInput()
            + " plugin:"
            + simple.getSimplePluginOutput()
            + " output:"
            + simple.getSimpleOutput());
  }
}
