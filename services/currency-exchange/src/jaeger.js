import jaeger from "jaeger-client";
import * as opentracing from "opentracing";

export const startJaeger = (name, req, res) => {
  const tracer = jaeger.initTracer({
    serviceName: "currency-exchange",
    sampler: { type: "ratelimiting", param: 5 },
  });
  const span = tracer.startSpan(name);
  span.addTags({
    [opentracing.Tags.HTTP_METHOD]: req.method,
    [opentracing.Tags.HTTP_URL]: req.path,
  });

  res.on("finish", () => {
    span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode);
    span.finish();
  });
  return { tracer, root: span };
};

export const startSpan = (name, context, parent) => {
  const { tracer } = context;
  if (parent === undefined) {
    parent = context.root;
  }
  const span = tracer.startSpan(name, {
    childOf: parent,
  });
  tracer.inject(span, opentracing.FORMAT_TEXT_MAP, {});
  return span;
};

export const stopSpan = (span) => {
  span.finish();
};

export default class Jaeger {
  constructor(name, req, res) {
    this.context = startJaeger(name, req, res);
    this.history = [];
  }

  start(name) {
    const span = startSpan(
      name,
      this.context,
      this.history[this.history.length - 1]
    );
    this.history.push(span);
  }

  stop() {
    const span = this.history.pop();
    stopSpan(span);
  }
}
