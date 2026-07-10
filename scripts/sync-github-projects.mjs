import { writeFile } from 'node:fs/promises';

const organization = 'yizhiyanhua-ai';
const repositories = [
  'fireworks-tech-graph',
  'fireworks-design',
  'fireworks-skill-memory',
  'fireworks-ai-tools-memory',
  'media-downloader',
  'skills-updater',
  'chuinb-skill',
  'youtube-ai-digest',
];

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'fireworks-community-site',
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchRepository(name) {
  const response = await fetch(`https://api.github.com/repos/${organization}/${name}`, { headers });
  if (!response.ok) throw new Error(`${name}: GitHub API ${response.status}`);

  const repository = await response.json();
  return [name, {
    stars: repository.stargazers_count,
    forks: repository.forks_count,
  }];
}

const entries = await Promise.all(repositories.map(fetchRepository));
const snapshot = {
  updatedAt: new Date().toISOString(),
  source: 'GitHub REST API public repository snapshot',
  projects: Object.fromEntries(entries),
};

await writeFile('public/assets/github-projects.json', `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote GitHub metrics for ${entries.length} projects.`);
