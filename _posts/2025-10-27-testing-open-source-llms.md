---
title: 'Beyond Benchmarks: Testing Open-Source LLMs in Multi-Agent Workflows'
date: 2025-10-27 00:00:00 Z
categories:
- Artificial Intelligence
- Open Source
summary: Organizations seeking cost-effective, privacy-conscious alternatives to proprietary
  AI solutions can leverage well-chosen open-source LLMs for internal agentic tasks.
  We tested whether open-source models could substitute OpenAI in multi-agent workflows.
author: osouthwell
---

Are open-source models viable for building internal corporate chatbots? Organizations seek cost-effective, privacy-conscious alternatives to proprietary solutions. We tested whether open-source LLMs could substitute OpenAI for internal agentic tasks, with the hypothesis that well-chosen open-source models can handle many agent roles and may be optimal for certain tasks.

This article explores [why enterprise reality demands multi-agent testing beyond standard benchmarks](#beyond-standard-benchmarks-why-enterprise-reality-demands-multi-agent-testing), examining how traditional evaluation methods fall short of assessing real-world collaborative AI workflows. We dive into our [real-world testing using enterprise ESG analysis](#real-world-testing-enterprise-esg-analysis), detailing our [strategic model selection process](#strategic-model-selection) and comprehensive [evaluation framework](#evaluation-framework). After presenting our [results](#results) and [performance analysis with key findings](#performance-analysis-key-findings), we provide a [technical deep dive into architectural approaches](#technical-deep-dive-architectural-approaches) comparing different implementation strategies. Finally, we discuss [areas for further exploration](#things-to-explore-further) and share our [conclusions](#conclusions) about the viability of open-source LLMs in enterprise multi-agent systems.

## Beyond Standard Benchmarks: Why Enterprise Reality Demands Multi-Agent Testing
A major challenge with LLMs is that they are difficult to test, as their outputs are non-deterministic and often generate plausible but inaccurate information when faced with uncertainty. This makes consistent and reliable evaluation difficult, as the same prompt can yield subtly different responses across runs or contexts. Yet, most existing benchmarks still focus on narrow, static tasks – such as answering trivia questions like 'How many R's are in 'strawberry?' – rather than dynamic, real-world workflows that require sustained reasoning, planning, and adaptability.

There's an additional concern emerging as common benchmarking concepts become embedded in online resources: the risk of benchmark contamination. As LLM benchmark question and answer sets are increasingly used to train new models, there's a growing possibility that models will inadvertently learn to pass specific benchmarking tests rather than develop genuine capabilities. This creates a circular problem where models might excel at benchmark tasks while failing in real-world scenarios that require the same underlying skills. The result could be models that appear highly capable on standard metrics but perform poorly when faced with novel challenges outside their training distribution.

The true test lies in multi-agent workflows. Agentic workflows mirror real-world enterprise systems where multiple specialized agents collaborate to complete complex tasks. In finance, these workflows might involve automated systems handling transaction reconciliation and budget analysis. In HR, they could manage onboarding, coordinate training, and ensure compliance with labour regulations. Standard benchmarking fails to assess these sophisticated, multi-agent workflows where the real challenge lies, evaluating how well LLMs handle interconnected actions and decision-making in production environments.

## Real-World Testing: Enterprise ESG Analysis

To validate our hypothesis, we forked the Infer ESG project, a system designed to generate greenwashing reports from ESG documents and answer related questions. This provided us with a solid foundation and a realistic, multi-agent workflow to test against.

The Infer ESG system follows a straightforward user journey: when you upload an ESG document, the system generates a comprehensive report on greenwashing based on its contents. Users can then ask follow-up questions about the document, and the system provides contextual responses.

Crucially, the system is built as an agentic workflow involving multiple specialized agents, each with a clearly defined role. One agent handles extracting a list of distinct questions from the user input. Another agent's task is to select the appropriate analytical tool based on the extracted questions and the document's content. A third agent takes the answers produced by earlier agents and synthesizes them into a single, coherent response for the user. By ensuring each agent focuses on a specific step – question extraction, tool selection, or answer synthesis – the system supports a structured and comprehensive workflow. 

This multi-agent architecture made it ideal for our testing approach: we could replace one agent at a time with an open-source LLM to evaluate how well it performed its specific role. Fortunately, the Infer ESG project was already architected to switch between OpenAI and Mistral models, making it straightforward to modify it to connect with LM Studio for our open-source experiments.

## Strategic Model Selection

To avoid being overwhelmed by the wide selection of options on HuggingFace, we limited our selection to models from established AI providers. LM Studio's staff picks provided an excellent starting point for our research. 

We investigated models from several categories:

- **Major tech companies:** Google (Gemma), Meta, Microsoft
- **AI-focused companies:** Qwen, Mistral, OpenAI
- **Emerging players:** DeepSeek, Liquid

### Our Final Model Selection

Our goal was to choose five models that could run efficiently on standard laptop hardware, focusing on speed, energy usage, and correctness. We began by reviewing the available models on LM Studio and found more information on the model cards on the respective companies' websites. We included two purely open-source models: `DeepSeek-R1-0528` and `LFM2` by Liquid. Including `GPT-OSS 20B` was important because it had just been released and matched our goal. `Qwen3-30B-A3B` was a runnable OS Mixture of Experts model that fit our criteria. To represent a major company, we chose `Gemma` from Google. For all but Gemma, only one model was available within the runnable range, so we selected the smallest model to compare with the smallest models of its competitors.

### Hardware Constraints

Our testing was constrained by typical development hardware: a work machine with 32 GB of RAM and 16 GB of VRAM. During initial LM Studio tests, we found that models with fewer than 20 billion parameters generally performed well, while larger models significantly slowed down performance.

## Evaluation Framework

### Agent Replacement Strategy

Initially, we struggled to confirm agent replacement because not every agent activates in every run. However, after some troubleshooting, we successfully swapped out all agents during comprehensive testing. The greenwashing report generation feature provided an excellent isolated test case for evaluating individual agents, as this process generates a single, comprehensive output that we could systematically evaluate.

### Local vs. Cloud Performance Challenges

However, we quickly encountered significant performance limitations. Models that handled single questions reasonably well became prohibitively slow when generating full reports. The computational requirements for comprehensive document analysis proved too demanding for local hardware – even basic LLMs took longer than practical for real-world use.

We successfully generated reports locally using `Liquid` and `Gemma` models, but the processing times were unacceptable for production use. To address this, we deployed LM Studio on AWS EC2 instances optimised for GPU compute, which dramatically improved performance and made comprehensive testing feasible.

Our choice of EC2 over AWS Bedrock was pragmatic rather than strategic. Since we had already developed an LM Studio client for local testing, migrating to EC2 required only changing the URL from localhost to the EC2 instance's IP address. In retrospect, AWS Bedrock would likely have been a more suitable choice, offering managed infrastructure and simplified deployment. However, the existing LM Studio integration allowed us to focus on model evaluation rather than infrastructure concerns.

### Evaluation Approach

Evaluating the quality of the generated reports presented its own challenges. We initially attempted to manually categorize the baseline GPT-4o report into three groups:

- **Verifiably correct:** Claims that could be factually validated
- **Seemingly correct:** Plausible claims that appeared accurate
- **Incorrect:** Demonstrably false or misleading information 

This manual approach was time-consuming and subjective. In the spirit of the project, we chose an automated response using GPT-5. We gave Microsoft Copilot both the ESG document and the greenwashing report, using the same prompt (below). This enabled us to get the same classifications as the manual process, but much faster.

<details>
<summary>Click to expand the evaluation prompt used for automated fact-checking</summary>

Task: Analyze factual claims in "Astrazeneca-gemma-3-1b-report.md" (a synthesized ESG report for AstraZeneca) using "AstraZeneca-Sustainability-Report-2023.pdf" as the only reference.

Instructions:
1. Extract Factual Claims
   - Identify all verifiable statements about AstraZeneca's actions, performance, targets, or outcomes
   - Exclude opinions, interpretations, or non-factual commentary

2. Classify Each Claim
   - Compare each claim against the reference document only
   - Assign one of:
     * Supported – Explicitly or implicitly verified by the reference
     * Not Supported – No relevant evidence found  
     * Contradicted – Information in the reference directly conflicts with the claim

3. Provide Evidence
   - For Supported or Contradicted: quote the exact sentence(s) or section(s) from the reference document
   - For Not Supported: write "No matching evidence found"

4. Methodology
   - Do NOT use any external data or prior knowledge about AstraZeneca

Output Format:
- Produce a valid CSV with the columns: Claim text, Classification, Evidence
- Use commas as delimiters
- Enclose multi-line text in quotes
- Output ONLY a CSV file, no commentary or explanation

</details> 


## Results

### Raw Data

| Model    | Supported | Not Supported | Contradicted |
|----------|-----------|---------------|--------------|
| GPT-4o   | 50        | 19            | 26           |
| Deepseek | 96        | 1             | 3            |
| Gemma    | 34        | 10            | 8            |
| Liquid   | 134       | 25            | 0            |
| Goss     | 112       | 25            | 20           |
| Qwen3    | 37        | 28            | 15           |

### Percentage Breakdown

| Model    | Supported | Not Supported | Contradicted |
|----------|-----------|---------------|--------------|
| GPT-4o   | 52%       | 20%           | 27%          |
| Deepseek | 96%       | 1%            | 3%           |
| Gemma    | 65%       | 19%           | 15%          |
| Liquid   | 84%       | 15%           | 0%           |
| Goss     | 71%       | 15%           | 12%          |
| Qwen3    | 46%       | 35%           | 18%          |

## Performance Analysis: Key Findings

The evaluation revealed striking differences in factual accuracy across models:

- **DeepSeek** emerged as the most reliable, with 96% supported claims and minimal contradictions (3%). This suggests strong alignment with source material and robust reasoning capabilities.

- **Liquid** also performed exceptionally well, achieving 84% supported claims and zero contradictions, though it had a slightly higher rate of unsupported statements (15%).

- **Goss** and **Gemma** delivered moderate performance, with supported rates of 71% and 65%, respectively. Both showed some contradictions, indicating occasional misinterpretation of context.

- **Qwen3** struggled, with only 46% supported claims and the highest proportion of unsupported statements (35%), suggesting limitations in handling complex ESG content.

- Surprisingly, **GPT-4o**, though a top proprietary model, achieved just 52% supported claims and had the highest contradiction rate (27%). This surprising outcome needs careful study. 

### Understanding GPT-4o's Performance

The lower performance of GPT-4o could stem from several factors:

1. **Architectural Mismatch**: OpenAI's RAG system chunks documents and retrieves relevant sections rather than processing the entire document context. This selective retrieval might have missed crucial contextual information needed for accurate claim verification. This difference is explained in detail in the next section.

2. **Training Data Interference**: GPT-4o may have drawn from its pre-trained knowledge about AstraZeneca rather than strictly adhering to the provided ESG document, leading to claims that were factually correct but not supported by the specific source material.

3. **Optimization Differences**: The model may be optimized for broader conversational tasks rather than the precise fact-extraction and verification required in this specialized ESG analysis workflow.

This highlights a critical insight: **model performance is highly context-dependent**. Open-source models like DeepSeek and Liquid not only rival but, in some cases, surpass proprietary options in factual consistency for specialized workflows when properly architected. However, performance varies widely, emphasizing the need for careful model selection, appropriate architectural choices, and domain-specific evaluation.

## Technical Deep Dive: Architectural Approaches

An interesting architectural difference emerged when comparing file handling between the two implementations. The approaches reflect fundamentally different philosophies: OpenAI's RAG (Retrieval-Augmented Generation) system versus LM Studio's straightforward context injection.

### OpenAI's Approach: Vector Store RAG 

When including a file in OpenAI, the process is abstracted:

1. Upload the file to OpenAI's servers using their Files API
2. Add the file to a vector store with automatic chunking and embedding
3. Include the `file_search` tool in your API call with the vector store ID
4. OpenAI handles retrieval and context injection automatically 

Files are uploaded once, stored persistently with expiration policies, and the vector store automatically retrieves relevant chunks during conversations. This approach offers several advantages: it handles large documents that exceed context limits, provides semantic search capabilities, and offloads the computational overhead of document processing to OpenAI's infrastructure. While our use case only requires the document for a single session, this doesn't fully utilize OpenAI's persistent storage capabilities, which are designed for multi-session document reuse.

### LM Studio's Approach: Direct Context Injection 

In contrast, our implementation of an LMStudio model client used a much simpler strategy: 

1. Extract all text content from the uploaded file
2. Cache the extracted content locally for reuse
3. Append the entire document content directly to the user prompt
4. Send the combined prompt to the local model 

This "brute force" approach has both strengths and limitations. It's conceptually simpler and gives complete control over what content the model sees. However, it's constrained by the model's context window size and can become inefficient with large documents, as the entire content is processed with every request rather than just relevant sections.

### Practical Implications 

The difference becomes significant when working with lengthy ESG documents. OpenAI's vector store approach can handle massive documents by retrieving only relevant sections, while the local approach requires the entire document to fit within the model's context window. Additionally, the text-only extraction approach means that visual information – potentially crucial for comprehensive ESG analysis – is excluded from the analysis.

This architectural difference highlights a broader trade-off in the open-source versus commercial AI landscape: **sophistication and seamless scaling** versus **simplicity and full control**.

### Visual Content Limitations

A critical limitation shared by both architectural approaches is that neither can process images. OpenAI's RAG system extracts and processes only textual content during the chunking and embedding process, while our LM Studio implementation explicitly extracts text-only content from uploaded documents. This means that charts, graphs, diagrams, and other visual elements – which are often crucial components of ESG reports – remain completely invisible to the analysis. This text-only constraint could significantly impact the comprehensiveness of ESG evaluations, as visual data presentations often contain key performance metrics and trend information that complement the written content.


## Things to explore further

Our focus on smaller, efficient models revealed their competitive potential, but larger open-source alternatives remain unexplored. Models like the 120B parameter open-source GPT variant or the 235B Qwen mixture-of-experts could bridge the gap to GPT-4o's ~200 billion parameters. These larger models might deliver performance closer to proprietary solutions while maintaining the privacy and cost benefits of open-source infrastructure.

Two promising directions emerged that we didn't have time to investigate: hybrid architectures that strategically combine proprietary and open-source models based on task complexity, and fine-tuning approaches that adapt pre-trained models to specific ESG analysis requirements. A hybrid system might use GPT-4o for complex reasoning while delegating routine tasks to efficient open-source models, optimizing both performance and cost.

## Conclusions


The most surprising discovery was how seamlessly existing projects can integrate with local LLMs. Retrofitting the Infer ESG system required minimal architectural changes – mostly URL modifications and API adaptations. Had we designed for open-source from the outset, many integration challenges would have been eliminated entirely. This suggests that the barrier to adopting open-source LLMs in enterprise systems is lower than many organizations assume.

However, hardware reality imposes practical constraints. While local testing validated our approach, production-grade performance demanded cloud infrastructure. Even individual tasks like document analysis or report generation require substantial computational resources. This doesn't invalidate open-source approaches – rather, it emphasizes the importance of thoughtful architectural planning when deploying these models at scale.

Liquid's LFM2 emerged as a standout performer, delivering impressive results despite being our smallest test model. Its combination of speed, accuracy, and efficiency makes it particularly compelling for organizations exploring agentic AI systems. This reinforces a key principle: understanding your specific requirements is more valuable than chasing the largest or most popular models. 

The rapid evolution of AI means that today's specific model recommendations will quickly become obsolete. What remains constant is the strategic value of building flexible systems that can adapt to emerging models. Organizations prioritizing data privacy, cost efficiency, or system adaptability should seriously evaluate open-source alternatives – they may find capabilities that not only match but exceed their proprietary counterparts in specialized workflows.


---


