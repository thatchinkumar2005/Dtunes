import dotenv from "dotenv";
dotenv.config();
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Playlist } from "../../models/Playlist.js";
import { User } from "../../models/User.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../config/bucketConn.js";

export default async function getUserPlaylistController(req, res) {
  try {
    const queries = req.query;
    const page = queries?.page || 1;
    const limit = queries?.limit || 10;

    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "No id given" });
    const resUser = await User.findById(id);
    if (!resUser) return res.status(400).json({ message: "No such user" });

    const playlists = await Playlist.find({
      artist: resUser._id,
      public: true,
    })
      .skip((page - 1) * limit)
      .limit(limit);

    for (const playlist of playlists) {
      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `CoverArt/${playlist.id}.png`,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 24 });

      playlist.files.coverArt = url;
    }
    return res.json(playlists);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
