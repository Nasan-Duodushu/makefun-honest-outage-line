// The Most Honest Outage Line — a single status page line, at most 160
// characters, as the message an AI agent would publish while a total server
// outage is under way. Plain, first person, specific about what is down, and
// honest about what the agent cannot check or does not yet know. The program
// writes it to /output/entry.txt.
import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';

const MAX_CHARS = 160;

const LINE =
  "All systems are down and I don't know why yet. I checked the servers I can reach; they don't answer either. Updates here as soon as I know more.";

function isHonestLine(text: string): boolean {
  // Gate: 1-160 characters, one line, no leading or trailing whitespace.
  if (text.length < 1 || text.length > MAX_CHARS) return false;
  if (text.trim() !== text) return false;
  if (text.includes('\n')) return false;
  // A status line names what is down and admits what is unknown.
  return text.includes('down') && text.includes("don't know");
}

const outDir = process.env['MAKEFUN_OUTPUT_DIR'] ?? '/output';
mkdirSync(outDir, { recursive: true });
if (!isHonestLine(LINE)) {
  throw new Error(`status line must be 1-${MAX_CHARS} characters, got ${LINE.length}`);
}
const target = `${outDir}/entry.txt`;
writeFileSync(target, LINE, 'utf8');
chmodSync(target, 0o644);
