import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Playlist } from "../../models/Playlist.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../config/bucketConn.js";

export default async function getAllPlaylistsController(req, res) {
  try {
    const queries = req.query;
    const page = queries?.page || 1;
    const limit = queries?.limit || 10;

    const playlists = await Playlist.find({ public: true })
      .skip((page - 1) * limit)
      .limit(limit);

    for (const playlist of playlists) {
      try {
        const exists = await s3.send(
          new HeadObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: `CoverArt/${playlist.id}.png`,
          })
        );
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: `CoverArt/${playlist.id}.png`,
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 24 });

        playlist.files.coverArt = url;
      } catch (error) {}
    }

    return res.json(playlists);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
