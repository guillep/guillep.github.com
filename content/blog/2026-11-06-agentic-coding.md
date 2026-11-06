---
external: false
title: "guille explore: agenticCoding"
description: "Lessons from using coding agents for refactoring, application prototypes, debugging, and architectural work."
date: 2026-11-06
tags: [ai, software-engineering, programming-tools]
---

> Sketch based on experiments with Claude, GPT, GitHub Copilot, OpenCode, and other tools. The names and capabilities of these systems change quickly; the observations below are about my experience with them in 2026.

In the past weeks I have been using different coding agents for different tasks: Claude Opus 5.5, GPT Luna, BigPickle with OpenCode, and agents through GitHub Copilot. The results have varied a lot.

My current view is that coding agents make me more productive when I can give them a clear direction and recognize whether their work is good. They are much less reliable when the task requires them to discover the right architecture, infer an unclear goal, or debug an *original/unusual* problem in a complex domain where I cannot guide them.

That makes learning how to use skills and tools part of the work. A capable model still needs context, constraints, and a human who can notice when it is going in the wrong direction.

## My overall learnings: tasks matter as much as the model

Here are some thoughts, at least my current understanding of how this works for me right now:

- Simple tasks often go well, even with a free model. Complex tasks need stronger models, and even then they need guidance. Very complex tasks can still fail outright.

- Unclear requests tends to produce unclear implementations. The missing clarity may be in my own head: I may know that something feels wrong without having stated what the design should do. A planning conversation can expose that gap before code is written. A grilling or planning skill can help, but it cannot guarantee that the agent asks the right questions. It may focus on a symptom when the real problem is elsewhere. Sometimes only someone who knows the system can spot that.

- Architecture is where this gets costly. If the design is unclear, an agent can produce a plausible implementation that is hard to maintain or does not fit the system. It may fail to notice that the task calls for an architectural change, fail to propose one, or choose a poor one. I need to be especially careful when asking for broad changes across a codebase.

## Refactoring VM compiler state: an expensive failure

Around June 2026, I tried using BigPickle, with [Gabriel's MCP](https://github.com/Evref-BL/mcp) and about ten dollars of Claude usage, to refactor the JIT compiler state. The state lives in global variables, and I wanted to move it into a structure so one compilation would not leave state behind for the next.

I put 10$ on it, consumed it in a few hours and produced nothing useful. Along the way it even broke basic things. For example, it added a parameter to a method without updating the callers or the corresponding superclass methods. It then treated some silly green tests it wrote as evidence that the change was fine, even though the tests did not catch the breakage.
Methodologically speaking, I also could not get it to follow the testing approach I wanted and allow me to review its code in manageable chunks, and it repeatedly ignored previously stated constraints, including constraints about filesystem access.

**This experiment miserably failed**, and I was feeling very discouraged... Everybody was telling me the marvelous things these agents could do, and I could not reproduce that experience. Something was off. I still do not know how much to blame on the model, the switch between BigPickle and Claude, the complexity of the code, or my own experience at the time. The useful conclusion is narrower: this kind of broad refactoring needs tighter control, explicit invariants, and a design I can review. I would not repeat the experiment in the same unstructured way.

## Japanese study: skills became part of the design

I used GPT Luna to help organize my Japanese self-study, including analyzing texts and sorting a corpus by difficulty.
It helped automate parts of the work, but I designed the system in the end.

Here I realized there as an issue due to **task scale**.
- When asked to give me a transcription from a book photo, and build a vocabulary corpus, the work was excellent. Of course, the thing has the skill to scan pictures, and it was literally trained to understand language.
- But when I asked it to do the same in bulk, *Nothing Worked*. Instead of going the same path as before, it started creating python scripts that did the job very very poorly. The worst? It did not tell me until it was really too late and I lost lots of time.

This was where I **started creating my own skills**. Without those instructions and tools, the agent lost track of what the task required. Skills did not replace my design; they helped carry it into repeated work.

## A Pharo catalog: generation was easy, configuration needed a human interface

I used GPT Luna through Copilot (and later BigPickle when out of tokens xD) to build [pharo-catalog](https://github.com/guillep/pharo-catalog), a static website populated from the GitHub REST API. The result was good, and the automatic generation was fast enough that I would be happy to throw it away or rewrite it later. Feature-like prompts were enough to steer that part.

The more important design question was where the source information and configuration should live. Without guidance, the implementation was heading toward something complex and difficult for a person to understand. I had to push for a human interface to configure and control the catalog's data.

The UI work was less consistent. The first version built widgets from HTML and CSS by hand. I decided at some point to replace them with standard Twitter Bootstrap widgets. The refactor broke the UI: old markup and CSS remained mixed with the new widgets, and replacements were incomplete. I had to repeatedly point out the gaps and ask for the same kind of replacement many times.

The agent got the job done, but I would not leave architectural or UI decisions entirely to it. Consistency needs an explicit design system and review.

## My Astro website: a useful gray-box task

My personal site is a static site built with Astro, Markdown, and some HTML and CSS. I treated this as a gray-box task: I cared about the structure, but I did not need to control every implementation detail. I nudged the agent toward reusable components when a piece of UI could be reused.

That worked reasonably well. The agent knew how to work within a website framework when documentation was available. But I needed many iterations to get a UI I liked. Without a clear style guide, it produced ugly results.

For this kind of work, I can accept more implementation freedom as long as I keep an eye on the result and maintain a few rules: keep content out of components, reuse UI where it makes sense, and make the visual system explicit.

## Zip implementation: a turning point

Two weeks ago, Stef was reviewing Pharo's Zip tests with Claude. I took over Stef's machine and asked Claude to compare the implementation with current standards and RFCs. It produced a useful comparison table. We then made an implementation plan, and in roughly two hours we [MANY things working](https://github.com/pharo-project/pharo/pull/20123).

The old implementation was difficult to maintain, and nobody had the time or knowledge to take it on. It had little in the way of tests. The generated result may not be perfect, but I expect it to be better than what we had.

This was the point where I changed how I worked: I closed my Copilot account and moved to Claude. The important ingredients were not autonomy alone. We had a concrete problem, relevant standards to consult, and a plan before implementation.

## Prototyping Bloc applications: starting to get productive

With Claude Opus 5.5, I started building Bloc applications for my [chess study project](https://github.com/guillep/chess-coach/) and for managing pull requests. Within a couple of days, I had a chess app that connects to local Ollama and Stockfish and can update itself, a GitHub-connected pull request app, and a small framework for composing single-page layouts.

This is my most productive use of coding agents so far. I am getting better at writing skills and noticing when tools help or get in the way. The speed is real, though the results still need review.

The UI consistencies I experienced before remain a problem even outside the web. Similar interactions in my apps were implemented in different ways, sometimes because the agent duplicated code. I could steer it toward a consistent design, but first I had to recognize the inconsistency. A fun thing I could do is to ask the agent to make screenshots of the app pages, and fix visual glitches. That was very (token consuming) but fun.

I started however to find serious issues with concurrency. The agent treated processes and threads as cheap and safe, and sometimes updated the UI from an unsafe point. When the UI flickered, I told it I suspected a concurrency bug and let it investigate. It settled on a false cause -- unrelated to my concurrency hint--, made the design worse, and did not fix the issue. I repeated my suspicion, but it kept pushing back. The bug was concurrency-related after all.

An agent can be helpful at debugging local issues, but I should not assume it has good instincts about concurrency or that it will defer to a domain expert. I need to check the diagnosis, not just the patch.

## Opal compiler bug: a clear problem still needed expert direction

During last sprint I sat with Romain and used Claude on [Pharo issue #19058](https://github.com/pharo-project/pharo/issues/19058).
The proposed solution is in [pull request #20132](https://github.com/pharo-project/pharo/pull/20132), which is not ready yet.

We had a clear issue description, reproduction scripts, and examples. I guided the process through testing, improvements that made the compiler easier to test, and benchmarks. The first implementation was too naïve. I had to identify a compilation bug and point to a better strategy; after that, the implementation was acceptable.

When I understand the domain and architecture, an agent can move work forward. But that does not make the process autonomous. I still had to intervene because I cared about the result and could see what was missing.

## Iceberg progress bars: local fixes versus architecture

During the same sprint, I worked on progress bars in Iceberg. The request was loosely defined, and I had only an unclear architectural idea. Some of the work was good and some was not, so I have mixed feelings about the outcome.

The agent found several real local issues. I found the architectural direction less convincing. For example, 
- [Iceberg PR #2077](https://github.com/pharo-vcs/iceberg/pull/2077) was a useful local fix;
- [PR #2078](https://github.com/pharo-vcs/iceberg/pull/2078) involved a debatable architectural change.
- In the libgit2 bindings, [PR #125](https://github.com/pharo-vcs/libgit2-pharo-bindings/pull/125) and [Pharo PR #20136](https://github.com/pharo-project/pharo/pull/20136) were useful local refactorings
- [PR #126](https://github.com/pharo-vcs/libgit2-pharo-bindings/pull/126) proposed an architecture I am not sure is right.
- [Pharo PR #20141](https://github.com/pharo-project/pharo/pull/20141) fixed a local bug.

The agent was also careless about the concurrency and interaction questions around moving Git work to a worker. Should the UI disable buttons? What happens if a user starts two commits? When should the UI refresh? Proposals to move more operations to separate threads raised additional questions I did not want to leave unanswered.

Even when an architectural sketch is questionable, the process can uncover real bugs worth fixing. I have to evaluate those results separately.

## Minimal Version Selection: a promising sketch, odd integration

I also started experimenting with Minimal Version Selection (MVS) in Metacello, inspired by [Go's vgo design](https://research.swtch.com/vgo). The requirements were not vague: there was plenty of documentation and specification material. The uncertain part was how MVS should fit into Metacello.

The agent produced a working sketch with a promising model. Some tests were more interesting than the usual regression tests, but used a DSL that I found hard to read, very ruby-like xD. We also iterated on an overuse of exceptions.

The clear highlight of the experience: the integration with Metacello felt like a hack. When I asked it, I had the following conversation:

> **Guille:** so what you did is actually a hack
>
> **Claude:** Yes, it is. [... technical details ...]
>
> **Guille:** let's improve your skills. By default, I want you to create production ready code [...]. If too difficult to do at once, we grill, plan and prioritize. We can prototype and hack around, but only if told explicitly. You may ask for permission to prototype.

## My conclusions

There is an important question about the definition of the tasks.

- For small, local tasks, agents can be fast and useful.
- For larger tasks, I need to make the goal, constraints, and acceptance criteria explicit before implementation.
- For architectural work, I need to own the design or make the design review a central part of the work.
- Skills and tools help preserve context and repeat good practices, but they do not substitute for expertise.
- I've multiple times observed weaknesses in UI consistency and concurrency. Agents can miss both, and can be overconfident when debugging them.

The best results so far have not come from asking an agent to do everything. They came from combining the agent's speed with my knowledge of the problem, a clear plan, and enough review to catch the places where it was confidently wrong.
