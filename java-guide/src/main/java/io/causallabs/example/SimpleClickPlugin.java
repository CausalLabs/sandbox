package io.causallabs.example;

import io.causallabs.example.Simple.Click;

public class SimpleClickPlugin implements SimpleClickPluginBase {

  @Override
  public void onEvent(Session session, Simple impression, Click click) throws Exception {
    System.out.println("Simple click with value: " + click.getClickValue());
  }
}
