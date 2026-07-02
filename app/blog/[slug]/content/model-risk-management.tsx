export default function ArticleContent() {
  return (
    <>
      <p>
        In May, EU lawmakers agreed to push the AI Act&apos;s high-risk
        obligations back by sixteen months, to December 2027. The stated
        reason was not politics. It was that the standards and tooling needed
        to comply do not exist yet.
      </p>

      <p>
        <a
          href="https://www.consilium.europa.eu/en/press/press-releases/2026/05/07/artificial-intelligence-council-and-parliament-agree-to-simplify-and-streamline-rules/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Council of the EU: Artificial intelligence — Council and Parliament
          agree to simplify and streamline rules
        </a>
      </p>

      <p>
        So, the most advanced AI regulation in the world slipped its main
        deadline because most of the key players have not yet built the
        machinery to govern these systems.
      </p>

      <p>
        I find that strange, because I spent a few years inside that
        machinery. It just had a different name.
      </p>

      <p>
        Every quarter brings a new responsible-AI framework. A principles
        deck. &ldquo;Fairness, accountability, transparency&rdquo;...the usual
        subjects. They describe what good governance looks like. Almost none
        of them tell you how to do it, which unfortunately is how regulation
        works - tells you the &ldquo;what&rdquo;, but the &ldquo;how&rdquo;
        (although for consultants and lawyers the what/how gap is a billing
        paradise!).
      </p>

      <p>
        Meanwhile, agentic systems are moving from chat into action. An agent
        no longer scores a decision and hands it to a human. It plans, calls
        tools, moves money, and books the next step before anyone reviews the
        last one. The oversight on these systems is often weaker than what a
        bank applies to a pricing spreadsheet.
      </p>

      <p>
        In my view, this gap is not a future problem but is a 2008-GFC-shaped
        problem waiting for its trigger.
      </p>

      <img
        src="/blog/ecb-article.jpg"
        alt="The European Central Bank tower and the Euro sign sculpture in Frankfurt"
        style={{ width: "100%", borderRadius: "12px", margin: "1rem 0" }}
      />

      <p>
        The AI industry is missing what Banks already solved under years of
        pressure, with real money, and a supervisor who could block the use of
        your internal-ratings-based models and cost you billions in
        unoptimized capital.
      </p>

      <p>
        It is called Model Risk Management. After the financial crisis,
        regulators stopped trusting banks to mark their own homework. In the
        US, the Federal Reserve codified it in SR 11-7. In Europe, the ECB ran
        a multi-year review that tore into every assumption behind the
        internal models of the continent&apos;s largest banks. If you have
        worked inside that world, you know the models banks built could (and
        were) challenged by an inspector line by line (discounting the role of
        Audit as 3LoD).
      </p>

      <p>
        Model risk management is not principles. It is plumbing. And the
        plumbing is exactly what AI governance lacks.
      </p>

      <p>
        Strip out the banking vocabulary and the controls map almost one to
        one onto agentic AI.
      </p>

      <ul>
        <li>
          <strong>Independent validation:</strong> In a bank, the team that
          builds a model never signs off on it. A separate function tries to
          break it. AI teams evaluate their own agents and call it done. The
          validator has to be someone with no stake in the launch.
        </li>
        <li>
          <strong>Three lines of defense:</strong> Who owns the agent, who
          challenges it, who audits it. Three different people. Most AI
          deployments collapse all three into the builder.
        </li>
        <li>
          <strong>Continuous monitoring:</strong> A model is not validated
          once. Its performance is tracked in production, and degradation
          triggers review. Agent evals are mostly pre-launch snapshots.
          Behavior in the wild drifts, and nobody is watching the dials.
        </li>
        <li>
          <strong>Documented limits:</strong> Every bank model ships with a
          written statement of where it works, where it breaks, and what it
          must never be used for. Agents ship with a system prompt and a
          prayer.
        </li>
        <li>
          <strong>Approved use only:</strong> A bank model is authorized for
          specific decisions. Using it elsewhere is a breach. Agents get
          handed open tool access and broad autonomy by default.
        </li>
        <li>
          <strong>Model ownership.</strong> Someone is personally accountable
          and holds the authority to halt the system. Name that person for
          your agents. If you cannot, you do not have governance. You have
          hope.
        </li>
      </ul>

      <img
        src="/blog/city-bg.jpg"
        alt="View looking up at financial district skyscrapers including Lloyd's of London"
        style={{ width: "100%", borderRadius: "12px", margin: "1rem 0" }}
      />

      <p>
        My main objection to all this is: banking is slow, bureaucratic, and
        almost seems allergic to shipping. But we do not have to import the
        bureaucracy. Just import the controls.
      </p>

      <p>
        The cost of model risk management was real: headcount, process,
        friction. But the alternative had a price too, and the market paid it
        in 2008. The lesson of that decade was not that risk is bad. It was
        that unpriced risk is fatal.
      </p>

      <p>Risk is not the enemy of speed. Unmeasured risk is.</p>

      <p>
        I believe that the teams that win the agent era will not be the ones
        with the best model. Models are commoditizing. The winners will be the
        ones who can prove their agents are safe to run, to a customer, an
        auditor, or a regulator who shows up in December 2027.
      </p>

      <p>
        That proof is a discipline. It already exists, refined over a decade
        under tough regulatory conditions.
      </p>

      <p>
        The AI industry does not need to invent AI governance. It needs to
        read what banking already wrote, and stop pretending there is no
        infrastructure.
      </p>

      <p>Hope you enjoyed the reading.</p>

      <p>Álvaro T.</p>
    </>
  );
}
