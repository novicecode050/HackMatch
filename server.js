const express = require('express');
const app = express();
app.use(express.json());

// In-memory data stores
let hackers = [];
let teams = [];

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'HackMatch API' });
});

// 1. POST /api/hackers — Register hacker profile and tech stack
app.post('/api/hackers', (req, res) => {
  const { name, role } = req.body; // role: 'Frontend', 'Backend', 'ML', 'DevOps'
  
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required fields.' });
  }

  const validRoles = ['Frontend', 'Backend', 'ML', 'DevOps'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  }

  const newHacker = { id: hackers.length + 1, name, role, assigned: false };
  hackers.push(newHacker);
  
  res.status(201).json({ message: 'Hacker registered successfully!', hacker: newHacker });
});

// 2. POST /api/teams/form — Algorithmic endpoint to group available students into balanced teams
app.post('/api/teams/form', (req, res) => {
  const unassignedHackers = hackers.filter(h => !h.assigned);
  
  // Group by role
  const frontends = unassignedHackers.filter(h => h.role === 'Frontend');
  const backends = unassignedHackers.filter(h => h.role === 'Backend');
  const mls = unassignedHackers.filter(h => h.role === 'ML');
  const devops = unassignedHackers.filter(h => h.role === 'DevOps');

  // Rule: A team requires at least 1 Frontend and 1 Backend developer
  if (frontends.length === 0 || backends.length === 0) {
    return res.status(400).json({ 
      error: 'Matching failed: Insufficient complementary tech stack members (requires at least 1 Frontend and 1 Backend).' 
    });
  }

  const formedTeams = [];
  while (frontends.length > 0 && backends.length > 0) {
    const teamMembers = [
      frontends.shift(),
      backends.shift()
    ];

    // Optionally add ML or DevOps if available
    if (mls.length > 0) teamMembers.push(mls.shift());
    if (devops.length > 0) teamMembers.push(devops.shift());

    teamMembers.forEach(m => m.assigned = true);

    const team = {
      teamId: teams.length + formedTeams.length + 1,
      members: teamMembers,
      createdAt: new Date().toISOString()
    };
    formedTeams.push(team);
  }

  teams.push(...formedTeams);
  res.status(200).json({ message: 'Teams formed successfully!', count: formedTeams.length, teams: formedTeams });
});

// 3. GET /api/teams — List active hackathon squads
app.get('/api/teams', (req, res) => {
  res.status(200).json({ count: teams.length, teams });
});

// Export app for testing, start server if run directly
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 HackMatch server running on port ${PORT}`);
  });
}

module.exports = app;
