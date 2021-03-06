import express from "express";
import slug from "slug";
import Pagination from "pagination-js";
import authMiddleware from "../middlewares/authMiddleware";
import ImageModel from "../models/image";
import imageType from "../../src/constants/imageType";
import multerUpload from "../config/multerUpload";
import DrinkModel from "../models/drink";
import Store from "../models/store";
import { cropImageThumbnail, getClientIP } from "../utils";

var router = express.Router();

router.post("/", multerUpload.single("image"), async (req, res) => {
  try {
    const { tableNumber, drinkId } = req.body;
    console.log("get IP");
    console.log(getClientIP(req));
    let drink = await DrinkModel.findOne({ _id: drinkId });
    let totalImage = await ImageModel.find({}).count();
    let fileName = `${tableNumber}_${slug(drink.name)}_${totalImage + 1}`;
    let image = new ImageModel();
    cropImageThumbnail(req.file.filename);
    image.name = fileName;
    image.fileName = req.file.filename;
    image.drinkId = drink.id;
    image.tableNumber = tableNumber;
    image.clientIP = getClientIP(req);
    await image.save();
    res.json(image);
  } catch (e) {
    res.json({ error: true });
  }
});

router.put("/print", authMiddleware, async (req, res) => {
  const { id } = req.body;
  let image = await ImageModel.findOne({ _id: id });
  if (!image) {
    res.json({ error: true });
  } else {
    image.type = imageType.PRINTED;
    await image.save();
    res.json(image);
  }
});

router.delete("/:imageId", authMiddleware, async (req, res) => {
  let image = await ImageModel.findOne({ _id: req.params.imageId });
  if (!image) {
    res.json({ success: false, message: "Image does'n exists" });
  } else {
    image.isTrashed = true;
    await image.save();
    res.json({ success: true });
  }
});

router.post("/delete-all", authMiddleware, async (req, res) => {
  ImageModel.update(
    {},
    { $set: { isTrashed: true } },
    { multi: true },
    (err, result) => {
      console.log(err);
      console.log(result);
      res.json({ success: true });
    }
  );
  //res.json({success: true});
});

router.post("/restore-all", authMiddleware, async (req, res) => {
  ImageModel.update(
    {},
    { $set: { isTrashed: false } },
    { multi: true },
    (err, result) => {
      res.json({ success: true });
    }
  );
});

async function imageByStoreMiddleware(req, res, next) {
  const { storeId } = req.query;
  let clientIps = [getClientIP(req)];
  let store = await Store.findOne({ _id: storeId });
  console.log(store);
  if (store) {
    let storeIp = store.ip;
    if (storeIp.indexOf(",") > -1) {
      clientIps = storeIp.split(",");
    } else clientIps = [storeIp];
  }
  req.clientIps = clientIps;
  next();
}

router.get("/", imageByStoreMiddleware, async (req, res) => {
  const { type } = req.query;
  // await ImageModel.find({}).remove();
  // default query all
  let objectQuery = { isTrashed: false, clientIP: { $in: req.clientIps } };
  // Query only type
  if (type !== imageType.ALL && type) {
    objectQuery = {
      $and: [
        { type: type },
        { isTrashed: false },
        { clientIP: { $in: req.clientIps } }
      ]
    };
  }

  const totalImages = await ImageModel.find(objectQuery).count();
  let pagination = new Pagination(req.query, totalImages).getPagination();
  const images = await ImageModel.find(objectQuery)
    .populate({
      path: "drinkId"
    })
    .sort({ createdAt: -1 })
    .skip(pagination.minIndex)
    .limit(pagination.itemPerPage);
  res.json({
    data: images,
    pagination
  });
});

export default router;
