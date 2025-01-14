import { Friend } from "../../../models/Friend.js";
import { User } from "../../../models/User.js";

export default async function getAuthUserFrndReln(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "No id given" });
    const otherUser = await User.findById(id);
    if (!otherUser) return res.status(400).json({ message: "No such user" });
    if (otherUser._id.equals(user.id))
      return res.status(400).json({ message: "You can't provide your id" });

    const acceptedReln = await Friend.findOne({
      friend: { $all: [user.id, id] },
      status: "accepted",
    });

    if (acceptedReln) return res.json(acceptedReln);

    const reln = await Friend.findOne({
      requester: user.id,
      requestee: id,
    });
    return res.json(reln);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
