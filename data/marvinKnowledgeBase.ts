export interface KnowledgeChunk {
    id: string;
    title: string;
    category: "AERO" | "TRACK" | "RACE";
    keywords: string[];
    content: string;
}

export const marvinKnowledgeBase: KnowledgeChunk[] = [
    {
        id: "aerocell-monocoque",
        title: "Aerocell Carbon Monocoque & Chassis",
        category: "AERO",
        keywords: ["chassis", "monocoque", "carbon", "aerocell", "frame", "tub", "weight", "structure", "chasis", "aerocel"],
        content: "The McLaren W1 is built on the Aerocell carbon-fiber monocoque, which integrates the driver's seating position to save weight and reduce the wheelbase. Inspired by Formula 1 engineering, it features high-torsional rigidity and integrated front and rear crash structures. The total dry vehicle weight is minimized to 1399 kg."
    },
    {
        id: "active-long-tail",
        title: "Active Long Tail & Aerodynamics",
        category: "TRACK",
        keywords: ["wing", "aero", "aerodynamics", "long tail", "active tail", "downforce", "drag", "drs", "wind tunnel", "rear wing", "spoiler"],
        content: "The W1 features an Active Long Tail rear wing that extends 300mm rearward when Race Mode is engaged. This mimics the DRS systems of F1 cars, reducing drag in straight lines and generating up to 1000 kg of total ground-effect downforce (350 kg front, 650 kg rear) for high-speed cornering stability."
    },
    {
        id: "mhp8-powertrain",
        title: "MHP8 Twin-Turbo V8 Engine",
        category: "RACE",
        keywords: ["engine", "v8", "twin-turbo", "combustion", "displacement", "mhp8", "rpm", "exhaust", "cylinders", "combustion", "exhaust"],
        content: "At the heart of the W1 is the MHP8 4.0-liter Twin-Turbo V8 engine, producing 928 HP on its own. It features a flat-plane crank design, revving up to 9200 RPM, coupled with a lightweight exhaust system that produces a raw, mechanical racing sound profile."
    },
    {
        id: "emodule-hybrid",
        title: "E-Module & Hybrid Battery Boost",
        category: "RACE",
        keywords: ["hybrid", "battery", "e-module", "electric", "motor", "torque fill", "instant", "flux", "charge", "battery", "electric"],
        content: "The V8 is paired with a motorsport-derived E-Module (radial flux electric motor) that contributes 347 HP and instant torque fill. Combined system power is 1275 HP. It runs on a high-density 1.38 kWh battery designed for immediate power discharge and quick regeneration under braking."
    },
    {
        id: "performance-specs",
        title: "Acceleration & Speed Telemetry",
        category: "RACE",
        keywords: ["specs", "specifications", "performance", "acceleration", "0-100", "0-200", "0-300", "top speed", "seconds", "times", "fast", "speed", "km/h", "accel"],
        content: "McLaren W1 official factory telemetry records:\n- 0-100 km/h: 2.7 seconds\n- 0-200 km/h: 5.8 seconds\n- 0-300 km/h: <12.7 seconds\n- Top Speed: 350 km/h (electronically limited).\n- Active wing angle adapts between 0° to 15° depending on deceleration, brake pressure, and corner entry speed."
    },
    {
        id: "price-allocation",
        title: "Pricing, Production Limit & Allocation",
        category: "AERO",
        keywords: ["price", "cost", "million", "buy", "order", "delivery", "allocated", "units", "build", "expensive", "how much"],
        content: "The base price for the McLaren W1 starts at €2.2 Million ($2.4 Million USD). Production is strictly limited to 399 units globally. All 399 units were pre-allocated to prospective owners prior to the official public reveal."
    },
    {
        id: "active-suspension",
        title: "Race Active Suspension & Suspension Hydraulics",
        category: "TRACK",
        keywords: ["suspension", "springs", "dampers", "handling", "hydraulic", "stiffness", "ride height", "ground clearance", "bumps", "roll", "shocks"],
        content: "The W1 utilizes McLaren's Race Active Chassis Control III suspension with active heave dampers. In Track/Race mode, the ride height lowers automatically (37mm front, 17mm rear) to optimize under-car ground effects and maximize tyre contact patches."
    }
];
