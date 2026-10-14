const players = [
  {
    name: "Alex Morganfield",
    position: "Midfielder",
    description:
      "A fictional profile exploring the role of a deep-lying playmaker.",
  },
  {
    name: "Jordan Ellis",
    position: "Forward",
    description: "A fictional profile illustrating movement between the lines.",
  },
  {
    name: "Casey Brooks",
    position: "Defender",
    description:
      "A fictional profile about communication and defensive organization.",
  },
];
export async function getPlayers() {
  return players;
}
