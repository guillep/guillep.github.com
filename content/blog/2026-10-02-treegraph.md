---
external: false
title: "Drafting a Tree graph scheduler for Druid"
description: "A bytecode generator for Druid IRs based on the tree graph algorithm"
date: 2026-10-02
tags: [pharo, compiler, druid]
---

Thist past weeks I resumed my work in Druid with Nahuel and Lucio.
One of the short term goals is to get the Druid compiler generate nice bytecode, and take from there to work on the optimizing compiler.

For those that want to know more about Druid, you can check:
 - [Nahuel's thesis](https://theses.hal.science/tel-05558340/document&ved=2ahUKEwjZlJ75sZuXAxULUKQEHe48CrgQFnoECBoQAQ&usg=AOvVaw0Gd5Eld1ogSGPVCuiOIDbh)
 - [His metacompilation paper](https://hal.science/PHARO/hal-05306190v1&ved=2ahUKEwjZlJ75sZuXAxULUKQEHe48CrgQFnoECCwQAQ&usg=AOvVaw2oa7vCArCjpY9-Dmj-V0Kf)
 - or [his paper on abstract interpretation for code generation](https://inria.hal.science/hal-05407834/)


The point is that so far, we were generating (kind of transpiling) the JIT compiler source code. That is, generating the JIT compiler frontend. But now we want to reuse the infra to generate bytecode directly. So we need a bytecode generator that goes from the graph-y Druid IR to bytecode.

It's amazing how few research is out there on this topic!
The only paper that describes an algorithm is this one:
[Treegraph-based Instruction Scheduling for Stack-based Virtual Machines](https://www.sciencedirect.com/science/article/pii/S1571066111001538&ved=2ahUKEwjzzLKJs5uXAxWcR1cBHd71Or8QFnoECBoQAQ&usg=AOvVaw3-JZtIohCyHDuZML_2eO9M).

So starting from there, I gave it a go at implementing it. Here are my learnings.

# From a dataflow graph to stack bytecode

Druid's IR implements a dataflow graph: that is, each instruction knows which values it needs, forming a dependency graph. From Druid's standpoint, a schedule is correct if all dependencies have been evaluated at the moment the instruction itself is evaluated. Stack bytecode is a bit more strict: operands must be on the runtime stack, in the right order, when the instruction executes.

One particular issue happens when a node in the graph is the dependency of several nodes.

![Node in several dependencies](/2026-10-02-treegraph/graph-with-reused-nodes.png)

Here, we would like to compute the value of `**` once, and reuse that value many times.
This is very important because `**` can have side effects. Imagine replacing ** by `openFile`.

Now, in the register world that's *easy*(er).
Put the value in a register, then use ther register.
In the stack world, however, it means that we need to put it int he stack, and reuse it...

But, as it turns out, Pharo's bytecode set has no instructions to reuse values on the stack! For example, it lacks `SWAP` or `FETCH` instructions what can be used to reorder the stack, or to access values that are further in the stack.

So I drafted a first version without that.

## Track the stack while generating

First things first, the generator starts visits the tree in depth-first postorder: an instruction is only visited once its operands have been visited, to ensure that values are available. The catch is: each instruction is generated only once, on the first visit, and its value is `dup`'d on the stack if it has more than one user.
However, this schema suddenly does not guarantee anymore that operands end up at the top of the stack in the required order!

In the example, we will do the following

```
push a
push b
push c
**
dup
````

Which leaves us a stack with:

```
a
b ** c
b ** c
```

And now the subtraction cannot be directly emitted!
We need to reorder the stack to ensure that `a` and `b ** c` are on the top, and the second `b ** c` is at the bottom to be used later.

How do we do that? we track what was generated on a compile-time stack.
When we generate an instruction, we verify if its operands match the stack top elements. If they do, there is nothing to do.
If they don't we reorder/shuffle the stack by popping stack values into temporaries and pushing them back in the desired order. This is deliberately straightforward, but can generate extra bytecode. A dedicated swap or fetch operation, or avoiding shared nodes in the generated representation, could improve it later.

## Still Work to do, but good enough

There are still edges to work through. It would be nice to distinguish instructions producing values in the stack from thoes that do not (e.g., jumps, rets, stores): those cannot be duplicated or popped like ordinary stack values.

The design's main simplification is architectural: instruction-specific visitors emit bytecode, while one shared scheduling path manages operand traversal, stack order, sharing, and last use. 

You may check my draft PR and its current limitations in [PR #277](https://github.com/Alamvic/druid/pull/277).
