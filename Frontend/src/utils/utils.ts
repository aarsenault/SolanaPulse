export function truncateAddress(input: string): string {
  if (input.length <= 6) {
    return input;
  }
  return `${input.slice(0, 3)}...${input.slice(-3)}`;
}
