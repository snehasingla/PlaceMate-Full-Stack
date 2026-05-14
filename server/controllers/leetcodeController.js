
// GET /api/dsa/leetcode/:username
const getLeetCodeStats = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(404).json({ message: "User not found or error fetching data" });
    }

    const stats = data.data?.matchedUser?.submitStats?.acSubmissionNum;
    if (!stats) {
      return res.status(404).json({ message: "No stats found for this user" });
    }

    // stats is an array: [{difficulty: 'All', count: X}, {difficulty: 'Easy', count: Y}, ...]
    const formattedStats = {
      total: stats.find(s => s.difficulty === "All")?.count || 0,
      easy: stats.find(s => s.difficulty === "Easy")?.count || 0,
      medium: stats.find(s => s.difficulty === "Medium")?.count || 0,
      hard: stats.find(s => s.difficulty === "Hard")?.count || 0,
    };

    res.json(formattedStats);
  } catch (error) {
    console.error("LeetCode fetch error:", error);
    res.status(500).json({ message: "Failed to fetch LeetCode stats" });
  }
};

module.exports = { getLeetCodeStats };
