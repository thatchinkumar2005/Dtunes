export default async function getAuthInfoController(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(204).json({ message: "No authenticated User" });
    }
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}