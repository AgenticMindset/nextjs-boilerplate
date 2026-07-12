export default function ArticleContent() {
  return (
    <>
      <p>
        I built a mid-range desktop PC a while ago. It is the kind of PC a
        teenager buys for shooters, and a few months ago it took over work I
        used to send to an API. Not because the local model is better (it is
        actually worse!), but because I realised what matters is &quot;what
        is the cheapest computation that clears the bar for this
        task.&quot; This may sound trivial, but in my view it is the whole
        story of compute right now.
      </p>

      <p>
        It took me too long to notice that worse was fine, and that the real
        question was never &quot;what is the best model.&quot;
      </p>

      <p>
        For a decade, software ran on an assumption that compute is
        &quot;basically&quot; free, and where it is not, it is someone
        else&apos;s problem, like f.e. the cloud provider&apos;s problem, or
        even worse: next quarter&apos;s problem ^^. Moore&apos;s law and VC
        money made that assumption rational. If an engineer&apos;s time cost
        more than the servers, you spent servers.
      </p>

      <p>
        That bought speed, and speed won markets. Then the prices changed,
        and some companies are struggling to survive the invoice.
      </p>

      <p>
        AI workloads need hardware efficient enough that it became a
        bottleneck, not just for hitting timelines but for controlling capex
        and energy costs. Fabrication takes years. Power contracts are
        negotiated like mineral rights. And when the fastest chips are
        scarce and sold by a market NVIDIA dominates with AMD a distant
        second, scarcity stops being a procurement detail and becomes a
        constraint on what you can build.
      </p>

      <p>
        That is what quietly changed the mindset. Efficiency stopped being a
        virtue and became a priced variable. The gap between a lazy
        implementation and a careful one was always there, five to twenty
        times on the same workload, but closing it was nobody&apos;s job
        until the meter started running. Nobody optimizes because a talk
        told them to. Everybody optimizes when every call has a number
        attached.
      </p>

      <p>
        For individuals, running models locally makes sense once you see it
        that way. The usual explanations are privacy and latency. Fair, but
        the interesting part is that local inference makes the marginal cost
        of an experiment zero. When every prompt costs money, you ration
        your own curiosity without noticing. You skip the dumb exploratory
        run that occasionally turns out not to be dumb. When the model runs
        on hardware you own, the meter disappears, and what changes is not
        your cost line but your behavior.
      </p>

      <img
        src="/blog/msi-1.jpg"
        alt="A GPU installed in a mid-range desktop PC build"
        style={{ width: "100%", borderRadius: "12px", margin: "1rem 0" }}
      />

      <p>
        Scale that same logic up and you get where companies are landing.
        Small models on owned hardware for high-frequency, low-stakes work.
        Rented cloud for training and spiky loads. Frontier APIs only where
        quality moves the outcome. The pattern is not cloud versus local. It
        is routing: match each unit of work to the cheapest substrate that
        clears the quality bar. Routing, not model selection, is in my view
        the way to go.
      </p>

      <p>
        Behind the price of tokens and chips, a harder constraint is coming:
        power. You can raise money on a funding cycle. You cannot raise a
        substation on one. So watts, not dollars, may end up being the thing
        you count.
      </p>

      <p>
        And counting is the point. Compute has become a material, and
        organizations are learning, some on purpose, some through invoices,
        to think like people who work with physical materials. A carpenter
        does not use hardwood where pine will do. That is not stinginess. It
        is respect for the material, and it is the same instinct as routing
        a task to the smallest thing that can do it.
      </p>

      <p>
        The card under my desk cost less than a new iPhone. The reframing it
        forced was the most valuable hardware I have bought in years.
      </p>

      <p>Hope you enjoyed the reading!</p>

      <p>Álvaro T.</p>
    </>
  );
}
