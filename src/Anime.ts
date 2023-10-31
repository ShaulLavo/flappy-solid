const clamp = (min: number, max: number, v: number) => Math.min(Math.max(v, min), max);


function lerp(start: number, end: number, alpha: number): number {
    return start * (1 - alpha) + end * alpha;
}

function inverseLerp(start: number, end: number, value: number): number {
    return (value - start) / (end - start);
}

const steps = (steps2: number, direction: 'end' | 'start' = "end") => (progress2: number) => {
    progress2 = direction === "end" ? Math.min(progress2, 0.999) : Math.max(progress2, 1e-3);
    const expanded = progress2 * steps2;
    const rounded = direction === "end" ? Math.floor(expanded) : Math.ceil(expanded);
    return clamp(0, 1, rounded / steps2);
};

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = 2 * Math.PI / 3;
const c5 = 2 * Math.PI / 4.5;
const bounceOut = (x: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
};
const easings = {
    linear: (x: number) => x,
    easeInQuad: (x: number) => x * x,
    easeOutQuad: (x: number) => 1 - (1 - x) * (1 - x),
    easeInOutQuad: (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    easeInCubic: (x: number) => x * x * x,
    easeOutCubic: (x: number) => 1 - Math.pow(1 - x, 3),
    easeInOutCubic: (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    easeInQuart: (x: number) => x * x * x * x,
    easeOutQuart: (x: number) => 1 - Math.pow(1 - x, 4),
    easeInOutQuart: (x: number) => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
    easeInQuint: (x: number) => x * x * x * x * x,
    easeOutQuint: (x: number) => 1 - Math.pow(1 - x, 5),
    easeInOutQuint: (x: number) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,
    easeInSine: (x: number) => 1 - Math.cos(x * Math.PI / 2),
    easeOutSine: (x: number) => Math.sin(x * Math.PI / 2),
    easeInOutSine: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
    easeInExpo: (x: number) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
    easeOutExpo: (x: number) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
    easeInOutExpo: (x: number) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
    easeInCirc: (x: number) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
    easeOutCirc: (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2)),
    easeInOutCirc: (x: number) => x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
    easeInBack: (x: number) => c3 * x * x * x - c1 * x * x,
    easeOutBack: (x: number) => 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2),
    easeInOutBack: (x: number) => x < 0.5 ? Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2,
    easeInElastic: (x: number) => x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4),
    easeOutElastic: (x: number) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1,
    easeInOutElastic: (x: number) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5) / 2 + 1,
    easeInBounce: (x: number) => 1 - bounceOut(1 - x),
    easeOutBounce: bounceOut,
    easeInOutBounce: (x: number) => x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2,
    steps
};

type SpringState = {
    position: number,
    velocity: number;
};

type SpringConfig = {
    stiffness: number,
    damping: number,
    mass: number;
};

const spring = (initialState: SpringState, config: SpringConfig, target: number, deltaTime: number): SpringState => {
    const { stiffness, damping, mass } = config;

    //  Hooke's Law
    const springForce = -stiffness * (initialState.position - target);
    const dampingForce = -damping * initialState.velocity;

    // Newton's Second Law
    const acceleration = (springForce + dampingForce) / mass;

    const newVelocity = initialState.velocity + acceleration * deltaTime;
    const newPosition = initialState.position + newVelocity * deltaTime;

    return {
        position: newPosition,
        velocity: newVelocity
    };
};

export { easings, spring, clamp, lerp, inverseLerp, bounceOut, steps };