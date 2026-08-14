## What this is

Linear regression tries to draw the straight line that best fits a scatter of points. "Best" means: the line that makes the smallest total error across every point.

A line is just two numbers: **slope** (how steep it is) and **intercept** (where it crosses the y-axis). The whole algorithm is really just a search for the right combination of those two numbers.

## The naive idea — and why it doesn't work

You could try to guess slope and intercept randomly, check the error, guess again, keep whichever guess was better. That works for tiny problems but doesn't scale — there's no way to know _which direction_ to guess next.

**Gradient descent** fixes this. Instead of guessing blindly, it looks at the current error and computes exactly which direction — and how much — to nudge slope and intercept to make the error smaller. Then it repeats that, a little at a time, until the line settles into place.

## The four things that happen every iteration

**1. Predict.** Using the current slope and intercept, calculate where the line thinks a point should be: `ŷ = slope · x + intercept`.

**2. Measure error.** Compare the prediction to the real value. The error for one point is `y - ŷ`. Averaged (and squared, so positive and negative errors don't cancel out) across every point, this becomes the **loss** — a single number describing how wrong the current line is.

**3. Compute the gradient.** This is the part that makes gradient descent actually smart. The gradient tells you, for a tiny nudge to slope (or intercept), how much the loss would change. If nudging slope up would make the loss worse, the gradient is positive — so you should move slope _down_ instead. That's why the update step subtracts the gradient rather than adding it.

**4. Update.** Move slope and intercept a small step in the direction that reduces loss: `slope = slope - learning_rate × gradient`. The **learning rate** controls how big that step is — too large and the line overshoots and oscillates, too small and it takes forever to converge.

Repeat all four steps enough times, and the line gradually rotates and shifts until it settles on a genuinely good fit.

## Why the learning rate matters

Try dragging the learning rate slider up in the visualization above. A very small rate makes the line creep toward the fit slowly but reliably. Push it too high and you'll actually see the line swing past the good fit and oscillate — sometimes even diverge entirely. This is the single most important hyperparameter in gradient descent, and it's worth getting an intuition for by just watching it misbehave.

## What "loss" actually measures

The loss shown here is **Mean Squared Error (MSE)** — average the squared distance between every point and the line. Squaring does two things: it makes all errors positive (so overestimates and underestimates don't cancel out), and it penalizes big misses much more than small ones — a point twice as far from the line contributes four times the loss.
