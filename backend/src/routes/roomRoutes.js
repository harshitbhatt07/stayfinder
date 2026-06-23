const router = require("express").Router();
const Room = require("../models/Room");
const { protect, allow, ownerApproved } = require("../middleware/auth");
const upload = require("../middleware/upload");

function normalizeRoomBody(body) {
  const data = { ...body };
  if (Object.prototype.hasOwnProperty.call(data, "price")) {
    data.price = Number(data.price);
  }
  return data;
}

function groupKey(room) {
  const ownerId = room.owner?._id || room.owner || "";
  return [
    ownerId,
    room.title || "",
    room.propertyName || "",
    room.city || "",
    room.state || "",
    room.price || "",
  ]
    .join("|")
    .toLowerCase();
}

function mergeRoomList(list) {
  const map = new Map();

  for (const room of list) {
    const obj = room.toObject ? room.toObject() : room;
    const key = groupKey(obj);

    if (!map.has(key)) {
      map.set(key, { ...obj, images: [...new Set(obj.images || [])] });
    } else {
      const existing = map.get(key);
      existing.images = [
        ...new Set([...(existing.images || []), ...(obj.images || [])]),
      ];
      existing.createdAt = existing.createdAt || obj.createdAt;
      existing.updatedAt = obj.updatedAt || existing.updatedAt;
    }
  }

  return [...map.values()];
}

router.get("/", async (req, res) => {
  try {
    const { city, maxPrice, category, q } = req.query;
    const filter = { status: "available", isApproved: true };

    if (city) filter.city = new RegExp(city, "i");
    if (category) filter.category = category;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { city: new RegExp(q, "i") },
        { propertyName: new RegExp(q, "i") },
      ];
    }

    const rooms = await Room.find(filter)
      .populate("owner", "name businessName upiId qrImage phone email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(mergeRoomList(rooms));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/owner/my", protect, allow("owner"), ownerApproved, async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(mergeRoomList(rooms));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("owner", "name businessName upiId qrImage phone email city state address")
      .lean();

    if (!room) return res.status(404).json({ message: "Room not found" });

    const siblings = await Room.find({
      owner: room.owner?._id || room.owner,
      title: room.title,
      propertyName: room.propertyName,
      city: room.city,
      state: room.state,
      price: room.price,
    }).lean();

    const allImages = [];
    siblings.forEach((r) =>
      (r.images || []).forEach((img) => {
        if (img && !allImages.includes(img)) allImages.push(img);
      })
    );

    room.images = allImages.length ? allImages : room.images || [];
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/",
  protect,
  allow("owner"),
  ownerApproved,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const images = (req.files || []).map((f) => f.path);

      const body = normalizeRoomBody(req.body);

      const amenities = body.amenities
        ? body.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [];

      const room = await Room.create({
        ...body,
        amenities,
        images,
        owner: req.user._id,
      });

      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/:id",
  protect,
  allow("owner"),
  ownerApproved,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const room = await Room.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });

      if (!room) return res.status(404).json({ message: "Room not found" });

      const images = (req.files || []).map((f) => f.path);
      const body = normalizeRoomBody(req.body);

      Object.assign(room, body);

      if (body.amenities) {
        room.amenities = body.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
      }

      if (images.length) room.images = images;

      await room.save();
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete("/:id", protect, allow("owner", "admin"), async (req, res) => {
  try {
    const query =
      req.user.role === "owner"
        ? { _id: req.params.id, owner: req.user._id }
        : { _id: req.params.id };

    const room = await Room.findOneAndDelete(query);

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch(
  "/:id/status",
  protect,
  allow("owner"),
  ownerApproved,
  async (req, res) => {
    try {
      const room = await Room.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });

      if (!room) return res.status(404).json({ message: "Room not found" });

      room.status = req.body.status;
      await room.save();

      res.json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;