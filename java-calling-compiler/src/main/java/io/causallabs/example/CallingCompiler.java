package io.causallabs.example;

import io.causallabs.mustache.Context;
import io.causallabs.parser.CompilerArgs;
import io.causallabs.parser.ParseErrorNoContext;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

public class CallingCompiler {
  public static void main(String[] args)
      throws IllegalArgumentException, IOException, InterruptedException, ParseErrorNoContext {
    // call the compiler with the given FDL
    CompilerArgs cargs = new CompilerArgs();
    cargs.files = List.of(Path.of("test.fdl"));
    io.causallabs.compiler.Compiler c = new io.causallabs.compiler.Compiler(cargs);
    c.run();
    // grab the mustache context and print out all the events.
    Context context = c.getMustacheContext(null);
    // now go ahead and print out all the feature events
    context
        .getFeatures()
        .forEach(
            f -> {
              String tableName = f.getWarehouseTableName();
              f.getFeatureEvents()
                  .forEach(
                      e -> {
                        String columnName = e.getColumnName();
                        System.out.println(tableName + "." + columnName);
                      });
            });
  }
}
