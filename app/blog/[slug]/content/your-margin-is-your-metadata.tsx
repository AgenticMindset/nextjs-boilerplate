export default function ArticleContent() {
  return (
    <>
      <p>
        There&apos;s a rule in information science that most retailers have never
        heard but will feel in their revenue within 36 months:
      </p>

      <p>
        <strong>Unindexed content does not exist.</strong>
      </p>

      <p>
        It doesn&apos;t matter how good it is. It doesn&apos;t matter how much
        you spent developing it. If a search system can&apos;t read it, it
        isn&apos;t there. This was the hard lesson of early SEO. The businesses
        that described their web pages in structured, crawlable terms got found.
        The businesses that buried information in Flash animations and
        image-only layouts became ghosts.
      </p>

      <p>
        We are about to learn this lesson again. But the stakes are higher, the
        timeline is shorter, and the &quot;search system&quot; is no longer a
        person typing keywords into Google.
      </p>

      <p>
        It&apos;s an AI agent making a purchase decision in milliseconds on
        behalf of a consumer who will never see your product page.
      </p>

      <h2>The real threat</h2>

      <p>
        What most mid-sized retailers believe the threat landscape looks like:
        Amazon on one side, Shein on the other, and margin compression in the
        middle. The strategic response is predictable. Cut costs. Optimize
        logistics. Maybe launch a loyalty program.
      </p>

      <p>
        <strong>None of that addresses what is actually coming.</strong>
      </p>

      <p>
        In agentic commerce, an AI agent acts on behalf of a shopper. The
        shopper says something like: &quot;I need a dress for a rooftop wedding
        in June, I run warm, I want to look put together but not overdressed,
        and I don&apos;t want to spend more than $300.&quot; The agent
        doesn&apos;t browse. It queries. It pulls structured product data from
        every merchant in its index, scores each item against the shopper&apos;s
        constraints, and returns a curated set of options.
      </p>

      <p>
        Now ask yourself: what does your product feed actually say about that
        item on page 14 of your catalog?
      </p>

      <p>
        If the answer is &quot;Black dress. Versatile. Perfect for any
        occasion&quot; you just got filtered out. Not because your product was
        wrong. Because your description was too thin for the agent to evaluate.
        You were semantically invisible.
      </p>

      <p>
        This is not a future scenario. Shopify&apos;s Model Context Protocol is
        live. OpenAI&apos;s agent APIs are in production. Google&apos;s shopping
        agents are indexing product feeds right now. The infrastructure for
        agent-mediated commerce is being built while most retailers are still
        debating whether to add a chatbot to their homepage.
      </p>

      <p>
        <strong>
          The margin compression retailers fear isn&apos;t coming from a
          competitor with lower prices. It&apos;s coming from their own product
          feeds.
        </strong>
      </p>

      <h2>The retrieval problem</h2>

      <p>
        In 1965, information scientist Gerard Salton developed the Vector Space
        Model, one of the foundational concepts behind modern search. The core
        principle is simple: a document is only as findable as its
        representation in the index.
      </p>
      <img
        src="/blog/vector-space-model.jpg"
        alt="Vector Space Model diagram showing how sentences are represented as vectors in a multi-dimensional term space"
        style={{ width: "100%", borderRadius: "12px", margin: "1rem 0" }}
      />

      <p>
        If you write a brilliant paper about &quot;cardiac events in
        post-operative patients&quot; but your metadata only says &quot;heart
        stuff,&quot; no search system will surface you for the right query. The
        content is there. The retrieval path is broken.
      </p>

      <p>
        <strong>
          Retail is sitting on the largest retrieval failure in commerce.
        </strong>
      </p>

      <p>
        The industry spends billions on product development. But then it
        describes those products with four words and a stock photo. A $2,000
        jacket might have &quot;wool blend blazer / navy / classic fit&quot; as
        its entire machine-readable identity.
      </p>

      <p>
        Compare this to what a knowledgeable sales associate would say about the
        same jacket: &quot;Structured but not stiff. Cool navy with a slight
        indigo undertone. Best paired with tapered trousers or dark denim, not
        chinos. Works for a creative office or a dinner reservation, not a
        formal board meeting. Runs slightly narrow in the shoulder for athletic
        builds.&quot;
      </p>

      <p>
        That associate just generated metadata worth thousands of dollars in
        conversion lift. And none of it exists in any product feed.
      </p>

      <h2>The lemons problem</h2>

      <p>
        George Akerlof won the Nobel Prize for describing this exact dynamic. In
        his 1970 paper &quot;The Market for Lemons,&quot; he showed that when
        buyers can&apos;t distinguish between high-quality and low-quality
        products due to poor information, the market collapses to the lowest
        common denominator. Sellers of quality goods exit, and only
        &quot;lemons&quot; remain.
      </p>

      <p>
        Thin product feeds are creating a lemon market. Not because the products
        are bad, but because the descriptions are too thin for any system (human
        or machine) to tell the difference between good and great.
      </p>

      <p>
        When an AI agent can&apos;t distinguish your $280 Italian-milled ponte
        dress from a $45 fast-fashion knockoff based on structured data alone,
        it will default to price. And you lose.
      </p>

      <h2>What the fix actually looks like</h2>

      <p>
        The fix is not a better chatbot. The fix is not a better recommendation
        carousel.{" "}
        <strong>
          The fix is treating product metadata as a strategic asset with the same
          rigor you&apos;d apply to inventory management or pricing strategy.
        </strong>
      </p>

      <p>
        <strong>
          1) Recognize that metadata is not a content task. It is an intelligence
          task.
        </strong>
      </p>

      <p>
        Writing product descriptions and building semantic metadata are two
        completely different activities. A product description sells to a human.
        Metadata sells to a machine. The first is prose. The second is
        structured, attribute-rich, context-aware data that tells an agent
        exactly who this product is for, what it pairs with, what occasions it
        fits, and what constraints it satisfies. This is not copywriting. This
        is product intelligence.
      </p>

      <p>
        <strong>
          2) Encode your domain knowledge before it walks out the door.
        </strong>
      </p>

      <p>
        Every retailer has at least one person who can look at a customer and
        assemble the right solution in under 60 seconds. That person&apos;s
        knowledge is worth millions in conversion lift, return reduction, and
        repeat purchase rates. But it lives in their head, works 40 hours a
        week, and leaves when they do. The retailers that encode that expertise
        into structured, machine-readable formats aren&apos;t just improving
        their product feeds. They&apos;re preserving their most valuable and
        most perishable competitive advantage.
      </p>

      <p>
        <strong>
          3) Measure the cost of semantic invisibility, not just the cost of
          technology.
        </strong>
      </p>

      <p>
        When I talk with mid-sized retailers, the question is always &quot;What
        does it cost to enrich our catalog?&quot; The better question is
        &quot;What is it costing us that our catalog is currently invisible to
        AI-driven discovery?&quot;
      </p>

      <p>
        If agents are already indexing your products and finding them too thin to
        recommend, you are losing revenue today. Not tomorrow. Today. And the
        gap compounds every month as agent adoption accelerates.
      </p>

      <h2>The bottom line</h2>

      <p>
        The mental model most retailers carry is: &quot;AI is a tool we&apos;ll
        adopt when the time is right.&quot; The reality is that AI is a system
        that is already evaluating you, and your product data is the exam.
      </p>

      <p>
        You don&apos;t get to decide when to show up. You only get to decide
        whether you&apos;re legible when the agent looks.
      </p>

      <p>
        Logistics has been solved. Payments have been solved. Fulfillment has
        been solved. The last frontier of competitive advantage in commerce is
        not operational efficiency. It is semantic clarity. The ability to
        describe what you sell with enough precision that a machine can match it
        to a human&apos;s actual need.
      </p>

      <p>Your margin is your metadata.</p>
      <p>
        Hope you enjoyed the reading. 
      </p>
      <p>
        Álvaro T.
      </p>

<div className="article-divider" />
      <h3>Sources</h3>

      <ul>
        <li>
          Akerlof, G.A. (1970). &quot;The Market for &apos;Lemons&apos;: Quality
          Uncertainty and the Market Mechanism.&quot; <em>The Quarterly Journal
          of Economics</em>, 84(3), 488-500.
        </li>
        <li>
          Salton, G., Wong, A., Yang, C.S. (1975). &quot;A Vector Space Model
          for Automatic Indexing.&quot; <em>Communications of the ACM</em>,
          18(11), 613-620.
        </li>
        <li>
          Nonaka, I. &amp; Takeuchi, H. (1995). <em>The Knowledge-Creating
          Company.</em> Oxford University Press.
        </li>
        <li>
          Shopify (2025). &quot;The Agentic Commerce Platform.&quot;
        </li>
      </ul>
    </>
  );
}
