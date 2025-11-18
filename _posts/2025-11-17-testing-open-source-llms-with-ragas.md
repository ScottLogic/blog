---
title: "Evaluating Answers with Large Language Models: How InferESG and RAGAS Helped"
date: 2025-11-17 15:00:00
author: afonseca
description: "A comparison of open-source and proprietary LLMs for ESG report evaluation using InferESG and RAGAS."
categories:
- Artificial Intelligence
- Open Source
- Testing
tags:
- LLM
- RAGAS
- ESG
- InferESG
- Evaluation
---

# Evaluating Answers with Large Language Models: How InferESG and RAGAS Helped

In this project we evaluated how different Large Language Models (LLMs) perform when responding to prompts derived from ESG reports. We built on InferESG — our system that generates greenwashing reports from ESG disclosures — and used RAGAS to create a test dataset and run structured evaluations. The aim was not to find a single winner, but to understand whether open-source models can be viable alternatives to proprietary systems and how they trade off accuracy, relevance, and efficiency.

## Models evaluated

We tested the following models (links are provided where available):

| Full model name | Short name | Params (B) | Producer | Date / notes | Link |
|---|---:|---:|---|---|---|
| DeepSeek-R1-0528-Qwen3-8B | DeepSeek | 8 | DeepSeek AI | ~Mar 2025 | https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF |
| Gemma 3 1B | Gemma-3-1B | 1.0 | Google / DeepMind | ~Mar 2025 | https://huggingface.co/google/gemma-3-1b |
| GPT-4o | GPT-4o | 200 | OpenAI | May 2024 | (see writeups) |
| GPT-4o-mini | GPT-4o-mini | 8 | OpenAI | — | (see writeups) |
| GPT-OSS-20B | GPT-OSS-20B | 20 | OpenAI | Aug 2025 | https://huggingface.co/openai/gpt-oss-20b |
| LFM2-1.2 | LFM2-1.2 | 1.2 | LiquidAI | — | https://huggingface.co/LiquidAI/LFM2-1.2B |
| Qwen3-30B-A3B | Qwen3-30B-A3B | 30.5 | Qwen | Aug 2025 | https://huggingface.co/Qwen/Qwen3-30B-A3B |

## The Role of InferESG

InferESG served as the core system in our experiment. It uses an agentic solver to break down the user’s request into subtasks and calls different LLMs with task-specific system contexts. Given a primary sustainability document, InferESG generates a greenwashing report that we then used as a basis for creating evaluation questions and reference answers.

To create a reliable baseline, we first produced a benchmark report: GPT-5 (used as a reference extractor) pulled factual statements from the report and classified them; these were then manually verified to ensure consistency and accuracy before building the test dataset.

## Evaluating with RAGAS

RAGAS (a Python library for evaluating Retrieval-Augmented Generation systems) played two central roles:

- generating the test dataset (Q&A pairs) from the InferESG report
- calculating metrics that quantify how well model answers match references and context

### Creating the test dataset

RAGAS produced thirty question–answer pairs based on the GPT-4o-generated greenwashing report. We used carefully designed prompts to extract focused Q&As and manually verified the results to establish a ground-truth dataset. Prompt design was critical: clear prompts produced consistent, high-quality Q&As, while ambiguous prompts introduced noise.

> Important: LLM hallucinations are a risk. We set model temperature to 0 in RAGAS to reduce speculative or fabricated responses, but manual verification remained essential for research-grade accuracy.

### Evaluation process

We automated the evaluation using a wrapper around the InferESG API. The pipeline:

1. Upload the published ESG report and produce a corresponding greenwashing report.
2. Ask the predefined questions from the baseline Q&A dataset.
3. Record model-generated responses in a structured format for evaluation by RAGAS.

To ensure repeatability, we made the session cache deterministic so each model evaluated the exact same generated report.

## Refining our metrics

Initially we tried faithfulness, semantic similarity and context precision, but found faithfulness sensitive to length differences between generated and reference answers. We therefore focused on metrics that better reflected answer quality for our use case:

- **Factual correctness** — whether model answers align with verified reference data
- **Answer accuracy** — how precisely a response addresses the question
- **Semantic similarity** — whether the intended meaning is preserved despite phrasing differences
- **Context precision / relevance** — how much retrieved context is used and how much the answer is supported by that context

- These metrics emphasize groundedness and task relevance rather than penalising brief, correct answers.

## The evaluation pipeline

Key steps executed for each model:

1. Run the wrapper: produce the report, ask the Q&A set and collect answers.
2. Use RAGAS to evaluate answers against the ground truth using the selected metrics.
3. Generate charts and summaries for each model and create comparative plots.

## Results — summary by metric

Below are the notable trends observed across models.

### Factual correctness

Performance varied considerably. In our runs:

- DeepSeek: ~0.15 (often semantically coherent but low factual grounding)
- Gemma-3-1B: ~0.19
- GPT-4o: ~0.08
- LFM2-1.2: ~0.14
- GPT-OSS-20B: ~0.20
- Qwen3-30B: ~0.28 (strongest factual grounding in our set)

Larger or newer systems tended to anchor facts better; however, this was not universally true and depended on retrieval and prompt quality.



![Two line bars show which points to skip or keep going for each test type]({{ site.github.url }}/afonseca/assets/Fatual_correctness.png)
### Answer accuracy

- GPT-OSS-20B: ~0.44 (highest accuracy — focused and on-topic answers)
- Qwen3-30B: ~0.40
- DeepSeek: ~0.38
- GPT-4o-mini: ~0.28
- LFM2-1.2: ~0.13

Some models provide coherent but incomplete or tangential answers; others produce precise answers but with factual errors.

![Two line bars show which points to skip or keep going for each test type]({{ site.github.url }}/afonseca/assets/Answer_accuracy.png)



### Semantic similarity

Most models score highly (≈0.85–0.89). This indicates that even when factual grounding is weak, outputs are often semantically aligned with reference answers. Qwen3-30B scored near the top for semantic similarity.

![Two line bars show which points to skip or keep going for each test type]({{ site.github.url }}/afonseca/assets/Semantic_similarity.png)

### Context precision / relevance

Across our tests, context precision and relevancy were generally high — the retriever supplied useful information in most cases. However, smaller models occasionally failed to leverage long or detailed contexts effectively.

### Observations

- There is a trade-off between semantic fluency and factual correctness: many models produce convincing prose that isn't always factually accurate.
- Answer accuracy does not always correlate with factual correctness — a model can be on-topic but still incorrect, or factually correct but incomplete.

## Which models performed best?

Overall, Qwen3-30B and GPT-OSS-20B were the most balanced in our evaluation: Qwen3-30B combined strong semantic similarity with relatively high factual correctness, while GPT-OSS-20B achieved the highest answer accuracy. DeepSeek and GPT-OSS-20B performed well for context precision and grounded responses. Smaller models like Gemma-3-1B and LFM2-1.2 are efficient and fast but less reliable for complex, high-recall tasks.

## Performance and efficiency

We instrumented timing for each LLM call. Key runtime observations:

- Qwen3-30B exceeded some pipeline timeouts (LMStudio queueing), making per-agent timing unreliable; high-level logs indicate ~5 hours total wall time for the whole run.
- DeepSeek: ~1h49m (File Agent ~1h7m, validator ~36m)
- GPT-4o-mini: ~1h18m (File Agent ~43m)
- GPT-4o: ~52m
- LFM2-1.2: ~36m
- Gemma-3-1B: ~2m

These numbers reflect differing hardware and deployment setups; shorter runtimes make models more usable in practice. Gemma-3-1B and LFM2-1.2 are efficient for light tasks; Qwen3-30B is powerful but resource-intensive.

![Two line bars show which points to skip or keep going for each test type]({{ site.github.url }}/afonseca/assets/performance_graph.png)

## Conclusions

1. RAGAS is a useful, structured framework for evaluating LLM answers across multiple dimensions. Results depend strongly on prompt and ground-truth quality.
2. Hallucinations remain a key concern. Setting temperature to 0 in RAGAS reduced speculative output, but manual verification is still essential.
3. Prompt design, retrieval quality and deterministic caching are crucial for fair comparisons between models.

Overall, Qwen3-30B and GPT-OSS-20B were the strongest performers in our experiments, balancing semantic alignment with factual grounding and answer accuracy. Smaller models remain valuable for fast, low-cost tasks but may need stronger retrieval or post-processing for high-accuracy applications such as greenwashing detection.

---
*If you want, I can:* 

- add the actual chart images (I can place them under `/assets/2025-10-29-testing-open-source-llms-with-ragas/`),
- include inline links to the referenced posts or Hugging Face pages,
- or tune the tone/length for your blog's style guide.



Full model name	Short name used in blog	Number of parameters (Billion)	Producer	Date published	 Link
 DeepSeek-R1-0528-Qwen3-8B
	DeepSeek	8 params	DeepSeek AI	~ March 2025 (Hugging Face)
unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF · Hugging Face 

Gemma 3 1B	Gemma 3 1B	1.0 params	Google / DeepMind	~ March 2025 (Google Developers Blog)
google/gemma-3-1b-it on Hugging Face

GPT 4o	GPT-4o	200 params	OpenAI	May 2024 (OpenAI)
https://aiexpjourney.substack.com/p/the-number-of-parameters-of-gpt-4o?utm_source=chatgpt.com 

GPT 4o mini	GPT-4o-mini	8 params	OpenAI	—	https://aiexpjourney.substack.com/p/the-number-of-parameters-of-gpt-4o?utm_source=chatgpt.com 

gpt oss 20b	GPT-OSS-20B	20 params	OpenAI	August 2025 (Hugging Face)
https://huggingface.co/openai/gpt-oss-20b 

LFM2 1.2	LFM2-1.2	1.2 params	LiquidAI	—	LiquidAI/LFM2-1.2B · Hugging Face

Qwen3 30B A3B	Qwen3-30B-A3B	30.5 params	Qwen 	August 2025 (Hugging Face)
Qwen/Qwen3-30B-A3B on Hugging Face






The Role of InferESG
InferESG served as the core system in our experiment. Under the hood, InferESG uses an agentic solver that breaks down the user’s request into specific subtasks and leverages various API calls to LLMs, each with task-specific system contexts. The system takes a primary sustainability document, analyses it, and generates a comprehensive greenwashing report. This generated report then serves as the foundation for evaluating and comparing the performance of other large language models. 
To ensure the accuracy of our generated reports before using them to build our test dataset, we first created a benchmark report. In this benchmark, GPT-5 extracted all factual statements and classified them. A manual verification was conducted at the end to ensure the generated report was consistent and accurate. For a better understanding of this process, you can refer to our blog, which provides a more detailed explanation of these steps.

Evaluating with RAGAS
The second part of the project focused on assessing model performance using Ragas, a Python library designed for evaluating LLM-based applications, particularly those that implement Retrieval-Augmented Generation (RAG).
 Ragas played a central role in both creating our test dataset and evaluating model outputs through a set of well-defined metrics.
Initially, Ragas helped generate our test dataset by creating thirty question–answer (Q&A) pairs based on the generated report by GPT-4o. We provided Ragas with carefully crafted prompts and instructions to extract meaningful Q&A pairs, which were then manually verified to establish a ground truth dataset. The design of these prompts was critical: clear, well-structured prompts guided the model to produce focused, relevant, and consistent answers, directly impacting the quality and reliability of the resulting dataset. Conversely, poorly designed or ambiguous prompts could lead to off-target or inconsistent responses, introducing noise and reducing the accuracy of subsequent evaluations.
Tip: One important point to keep in mind when working with LLMs is the risk of hallucinations, instances where a model generates content that sounds plausible but isn’t factually accurate. In our experiments generating Q&A datasets, we found that setting the model temperature to 0 within Ragas significantly helped mitigate this issue, reducing speculative or fabricated responses and improving overall answer fidelity. However, even with this adjustment, manual verification remains essential to ensure the accuracy and reliability of the generated answers, especially in research or evaluation contexts where precision matters.
Once our test dataset was ready, the next step involved selecting metrics to evaluate the accuracy and quality of answers generated by different LLMs. We built a script to automate this process, using the questions from the test dataset, the generated report, and each model’s answers as inputs.
Refining Our Metrics
Initially, we evaluated model performance using faithfulness, semantic similarity, and context precision. However, we quickly realized that faithfulness was not ideal for our case. The metric appeared to be influenced heavily by the length difference between the generated answer and the reference text: shorter reference answers often led to lower faithfulness scores, even when the generated responses were factually accurate. This discrepancy was particularly evident in the charts produced by Ragas, where faithfulness consistently underestimated the true quality of the responses upon manual review.
These metrics were chosen because they directly evaluate the quality of the generated answers relative to the user input, reference text, and reference contexts, rather than penalizing answers for minor length differences or variations in phrasing. They were also chosen because InferESG is a non-RAG model, and therefore we selected non-RAG metrics that do not take into consideration any retrieved context.
Factual correctness measures whether the information in the generated answer aligns with verified reference data. It ensures that the model produces reliable, verifiable content rather than plausible sounding but incorrect statements. 
Answer accuracy evaluates how precisely the response addresses the question asked, capturing the relevance and completeness of the answer. 
Semantic similarity assesses whether the intended meaning of the reference is preserved, even when the wording differs, ensuring that variations in phrasing do not unfairly penalize the model.
This refined combination of metrics provided a more balanced and reliable view of model performance.
The Evaluation Pipeline
As mentioned before on the Evaluation with Ragas we developed a systematic evaluation workflow, starting with a baseline Q&A dataset from AstraZeneca’s ESG report, using carefully crafted prompts to ensure consistent, high-quality answers for accurate performance assessment.
This baseline ensured that all models were tested under consistent and comparable conditions.
Next, we created a wrapper around the InferESG API to automate the following sequence:
1.	Upload the published ESG report and produce a corresponding greenwashing report.
2.	Ask predefined questions about AstraZeneca using the baseline Q&A dataset.
3.	Record the model-generated responses in a structured format.
This automated pipeline was intentionally designed for repeatability, allowing us to alternate between different LLMs during the questioning phase and evaluate their performance under identical parameters.
InferESG operated with a session-based cache to store reports generated in step (1). However, when switching between models, the cache would reset, leading to non-equivalent comparisons, each model was effectively responding to slightly different report inputs. To correct this, we temporarily adjusted the session cache to function deterministically, ensuring that every model used the same generated greenwashing report for evaluation.
With the setup standardized, the following steps were executed to gather and interpret results:
1.	Perform Ragas evaluations using selected metrics against the established test dataset.
2.	Examine results through charts and performance summaries automatically generated by Ragas  for each model.
3.	Develop a comparative chart illustrating a single key metric across all models to facilitate visual comparison of their performance.

Results:
When comparing the metric charts average performance results of the different LLMs we could see that for:
In terms of factual correctness, the results vary considerably across models. DeepSeek shows relatively low factual reliability, with an average score of about 0.15, suggesting that its answers often contain inaccuracies or incomplete information. Gemma-3.1b performs slightly better, averaging around 0.19, which indicates a modest improvement but still leaves room for error. GPT-4o and LFM2-1.2 both demonstrate lower factual correctness, around 0.08 and 0.14 respectively, implying that they tend to produce factually inconsistent statements. The strongest factual grounding is found in Qwen3-30b and GPT-OSS-20b, which reach approximately 0.28 and 0.20 on average. These models show a greater capacity to produce information that is verifiably true, especially regarding specific ESG commitments and targets. Overall, factual correctness appears uneven across the models, with newer and larger systems demonstrating a better ability to anchor their responses in reliable data.

When examining answer accuracy, which evaluates whether a response directly and correctly addresses the question, performance differences again become clear. DeepSeek performs moderately well with an average of around 0.38, suggesting that it often understands and responds to the question’s intent even when its factual grounding is imperfect. Gemma-3.1b and GPT-4o-mini, by contrast, show lower accuracy, at approximately 0.09 and 0.28, this could mean that they frequently offer partial or tangential answers. GPT-OSS-20b achieves the highest answer accuracy at about 0.44, reflecting a strong ability to remain relevant and focused on the specific question. LFM2-1.2 and Qwen3-30b fall between these extremes, with averages around 0.13 and 0.40 respectively, indicating a mix of correct and incomplete responses. From these results, it becomes evident that some models are capable of formulating coherent, targeted answers even without perfect factual precision, while others struggle to stay on topic or fully meet the informational requirements of the questions.
The third metric, semantic similarity, captures how closely the meaning and context of a model’s response align with an ideal reference answer. Here, the performance is consistently strong across nearly all models. Most systems achieve scores between 0.85 and 0.89, showing that even when the details are inaccurate, the responses tend to sound relevant, structured, and contextually appropriate. DeepSeek’s average of 0.88 suggests that it can produce text semantically close to reference answers despite factual inconsistencies. Gemma-3.1b, GPT-4o, and GPT-4o-mini score slightly lower, between 0.85 and 0.87, still demonstrating good linguistic and contextual alignment. The highest semantic similarity belongs to Qwen3-30b, with an average close to 0.89, confirming that its answers are not only meaningful but also stylistically and contextually consistent with the expected responses. This overall trend indicates that language models are generally proficient at producing coherent and semantically aligned outputs, even when the underlying factual content is weak.
Taken together, these results highlight an important pattern: there is a noticeable trade-off between factual correctness and semantic fluency. Many models can produce convincing, well-phrased answers that align semantically with reference texts but fail to maintain factual integrity. Similarly, answer accuracy does not always correlate with factual correctness, some models provide responses that sound right but lack true substance, while others offer factually accurate information that only partially addresses the question. Among all evaluated models, Qwen3-30b demonstrates the most balanced performance, combining strong semantic similarity with relatively high factual correctness and solid answer accuracy. GPT-OSS-20b also performs particularly well in terms of accuracy, confirming its ability to generate relevant and contextually precise responses. On the other hand, GPT-4o and LFM2-1.2 show lower factual correctness and moderate accuracy, suggesting that they could benefit from better grounding in verifiable knowledge sources.

What models performed best based on our selected metrics to evaluate the generated answers?
Based on the selected evaluation metrics: factual correctness, answer accuracy, and semantic similarity, the models that performed best overall were Qwen3-30b and GPT-OSS-20b. Both demonstrated a strong balance between generating responses that were contextually relevant, accurate, and factually grounded.
Qwen3-30b stood out as the most consistent and well-rounded model across all three dimensions. It achieved the highest semantic similarity scores, indicating that its responses were closely aligned in meaning and structure with reference answers. This suggests that Qwen3-30b not only understood the questions well but also produced answers that captured their intended nuance and context. Moreover, it performed above average in both factual correctness and answer accuracy, showing that its outputs were not just well-worded but also grounded in verifiable information. This combination of coherence, precision, and truthfulness positions Qwen3-30b as the most reliable model in this evaluation.
GPT-OSS-20b also performed strongly, particularly in answer accuracy, where it achieved the highest scores among all models. Its responses were consistently relevant and directly addressed the questions, which indicates a strong capacity for comprehension and contextual reasoning. While its factual correctness was slightly lower than Qwen3-30b’s, GPT-OSS-20b still demonstrated a commendable ability to produce precise and logically consistent answers. This suggests that the model effectively balances understanding with factual recall, making it highly effective for question-answering tasks that require clarity and directness.
In contrast, models such as DeepSeek, Gemma-3.1b, GPT-4o, and LFM2-1.2 displayed more variability. DeepSeek, for instance, produced semantically coherent responses but often lacked factual accuracy. Gemma-3.1b and GPT-4o exhibited a similar pattern, where linguistic fluency was strong, yet the factual grounding was limited. LFM2-1.2 showed moderate performance across the metrics but did not reach the level of reliability seen in the top-performing models. These results illustrate that while many models can generate convincing and contextually appropriate text, maintaining factual precision remains a key challenge.
Overall, the comparison reveals that Qwen3-30b and GPT-OSS-20b represent the most capable and balanced performers in this evaluation. They managed to combine factual accuracy, question relevance, and semantic coherence more effectively than the others. This finding underscores the importance of both factual grounding and semantic understanding in producing trustworthy, high-quality answers, qualities that these two models consistently demonstrated.




Performance and Efficiency of the AI models
In terms of execution duration, to calculate the duration of each call to LLMs, we instrumented our analysis code to record start and end times. For models other than Qwen3-30B, this approach proved an effective way of calculating the individual usage of each agent. For Qwen3-30B, individual model analysis exceeded the time-outs built into our analysis pipeline resulting in LMStudio queueing tasks. This invalidates the data we have derived for individual agents. We can estimate the total time spent processing using the LLM from high-level log timestamps, which started at T14:30:18 and finished at T19:35:30, giving an upper bound of approximately 5hrs processing time.
The second longest model is DeepSeek (deepseek-r1-0528-qwen3-8b) that follows with ≈1 h 49 min, mainly in File Agent (≈ 1 hour 7 min) and validator (≈  36 min), representing a balanced trade-off between computational capability and efficiency.  
 Directly comparing computation cost across models is challenging because they were run on different hardware. However, certain runtime patterns can still be observed. 
GPT-4o-mini recorded a total of 1h18 min, with most of the time distributed between the File Agent (≈ 43 min) and generalist (≈ 5 min) components, indicating moderate computational demand. In comparison, GPT-4o totalled ≈ 52 min, primarily concentrated in the router (≈ 23 min) and File Agent (≈ 21 min) modules. 
Despite these variations, the shorter runtimes of GPT-4o and GPT-4o-mini make them far more usable in practice. Users are unlikely to wait extended periods for a local model to produce results, no matter how strong the final output, leading to frustration or a shift toward faster alternatives. This usability gap could be narrowed if local models were deployed on higher-performance hardware, reducing inference times and making them more practical for real-world use.
The most efficient models are Liquid lfm2-1.2b (≈ 36 min) and Google Gemma-3-1B (≈ 2 min), with minimal durations across stages, making them ideal for lightweight or time-sensitive tasks, though less suited for workloads requiring extensive reasoning or data validation.
Overall, this spectrum highlights a clear trade-off: Qwen3-30B-A3B handles the most complex tasks, DeepSeek and GPT-4o-mini balance performance and efficiency, GPT-4o provides advanced reasoning at moderate cost, and Gemma-3-1b and Liquid lfm2-1.2b excel in speed and efficiency for simpler or time-critical applications. 
 














Conclusions: 
Our evaluation demonstrates that Ragas a valuable tool for assessing LLM-generated answers using structured metrics, providing a clear framework for comparing models across multiple dimensions. However, several considerations are crucial for obtaining reliable results.
First, the quality of evaluation heavily depends on the clarity of questions and the quality of reference context. LLM outputs are context-sensitive, and poorly defined questions or insufficient reference material can significantly impact performance metrics.
Second, hallucinations remain a concern with LLMs. In our experiments, setting the model temperature to 0 within Ragas helped mitigate this issue. Reducing the temperature controls the randomness of a model’s output and makes it more deterministic, increasing the likelihood of selecting the most probable next token. However, it also limits response diversity and nuance, making outputs more rigid and less adaptable to ambiguous queries. Overall, this helped reduce speculative or fabricated responses and improved answer fidelity.
Third, prompt design is critical. Clear, well-structured prompts ensure that LLMs generate focused and relevant answers, which in turn supports more accurate evaluation outcomes.
Overall, the results across all models were generally positive, particularly in terms of semantic similarity, which remained consistently high across the board, indicating that most models preserved the intended meaning of answers even when phrasing differed from the reference.
On average, Qwen3-30B emerged as the strongest performer, excelling in factual correctness and maintaining high semantic similarity, making it the most robust and reliable model for generating accurate, contextually grounded, and relevant answers. GPT-OSS-20B also performed very well, with strong answer accuracy and semantic similarity, making it a solid choice for balanced performance.
In terms of performance and efficiency, Qwen3-30B-A3B (31B params) is the most computationally intensive model, excelling at complex, high-reasoning tasks but with longer execution times, particularly noticeable on local hardware. GPT-4o (200B params) offers the most advanced reasoning capabilities, though its large size comes with substantial computational cost. Models such as DeepSeek (8B params) and GPT-4o-mini (8B params) strike a balance between performance and efficiency, providing strong results with moderate runtimes. Smaller models like Gemma-3-1B and LFM2-1.2B (1B params each) are highly efficient and fast, making them well-suited for lightweight or time-sensitive tasks, though they are less capable of handling workloads that require extensive reasoning.
These results align with the expectation that larger models generally perform better due to their increased parameter capacity but at the cost of speed and computational demand. Our experiments not only confirm this hypothesis but also quantify the extent of the trade-offs, demonstrating that careful model selection, considering both task complexity and hardware constraints, is crucial for optimizing performance in practice.
These findings highlight the effectiveness of combining Ragas with careful dataset design, prompt engineering, and parameter tuning to conduct rigorous LLM evaluations for complex tasks such as greenwashing detection.

