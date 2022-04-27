const Category = require("../models/Category.js");
const Bank = require("../models/Bank.js");
const Image = require("../models/Image.js");
const Item = require("../models/Item.js");
const Feature = require("../models/Feature.js");
const Activity = require("../models/Activity.js");
const Booking = require("../models/Booking.js");
const Users = require("../models/Users.js");
const Member = require("../models/Member.js");
const bcrypt = require("bcryptjs");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  viewSingin: (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          alert,
          title: "Staycation | Login",
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash("alertMessage", "User not found !");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
        return;
      }
      const IsPasswordMatch = await bcrypt.compare(password, user.password);
      if (!IsPasswordMatch) {
        req.flash("alertMessage", "wrong password !");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
        return;
      }

      req.session.user = {
        id: user.id,
        username: user.username,
      };

      res.redirect("/admin/dashboard");
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/signin");
  },

  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("admin/dashboard/view-dashboard", {
        title: "staycation | Dashboard",
        user: req.session.user,
        member,
        booking,
        item,
      });
    } catch (error) {}
  },

  //controller category
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view-category", {
        title: "staycation | category",
        user: req.session.user,
        category,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "success Add Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Success Update Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });
    await category.remove();
    req.flash("alertMessage", "Success Delete Category");
    req.flash("alertStatus", "success");
    res.redirect("/admin/category");
  },

  //controller bank
  viewBank: async (req, res) => {
    const bank = await Bank.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/bank/view-bank", {
      title: "staycation | Bank",
      user: req.session.user,
      alert,
      bank,
    });
  },

  addBank: async (req, res) => {
    // console.log(req.body.id);
    try {
      const { name, nameBank, nomerRekening } = req.body;
      await Bank.create({
        name,
        nameBank,
        nomerRekening,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "success Add Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomerRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomerRekening = nomerRekening;
        await bank.save();
        req.flash("alertMessage", "Success Update Bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.nameBank = nameBank;
        bank.nomerRekening = nomerRekening;
        bank.name = name;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", "Success Update Bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Success Delete Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  //controller item
  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view-item", {
        title: "staycation | Item",
        user: req.session.user,
        item,
        category,
        alert,
        action: "view",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  addItem: async (req, res) => {
    try {
      //get data dari form add Item
      const { title, price, city, categoryId, about } = req.body;
      //jika file lebih dari 1
      if (req.files.length > 0) {
        //cari id db category yang sama dengan category item
        const category = await Category.findOne({ _id: categoryId });
        // ctreate ke database Item
        const item = await Item.create({
          categoryId: category._id,
          title,
          description: about,
          city,
          price,
        });
        //memasukan data itemId ( dicategory) dari db Item
        category.itemId.push({ _id: item._id });
        await category.save();
        //terlusuri semua req.files
        for (let i = 0; i < req.files.length; i++) {
          //create image ke db Images
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          //masukan image ke field imageId di dbItem
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMessage", "Success Add Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view-item", {
        title: "Staycation | Show Image Item",
        user: req.session.user,
        alert,
        item,
        action: "show image",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.find();
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view-item", {
        title: "Staycation | Show Image Item",
        user: req.session.user,
        alert,
        item,
        category,
        action: "edit",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  editItem: async (req, res) => {
    try {
      //ambil id dari url
      const { id } = req.params;
      //ambil kiriman dari form
      const { title, price, city, categoryId, about } = req.body;
      //ambil id itm dr Db item, ini dengan id dari url
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      //kondisi jika ada gambar yang di edit
      if (req.files.length > 0) {
        //looping semua file jika ada
        for (let i = 0; i < item.imageId.length; i++) {
          //ambil id dimasing-masing gambar yang di looping
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          //hapus gambar di folder public
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          //isi image url dengan image yang baru,save
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.categoryId = categoryId;
        item.about = about;
        await item.save();
        req.flash("alertMessage", "Success Update Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.categoryId = categoryId;
        item.about = about;
        await item.save();
        req.flash("alertMessage", "Success update Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          });
      }
      await item.remove();
      req.flash("alertMessage", "Success delete Item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });
      res.render("admin/item/detail-item/show-detail-item", {
        title: "staycation | Item",
        user: req.session.user,
        alert,
        itemId,
        feature,
        activity,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/${itemId}`);
    }
  },

  //feature activity

  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "success image 404");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash("alertMessage", "success Add Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMessage", "Success Update Feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        req.flash("alertMessage", "Success Update Feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });
      // const item = await Item.findOne({ _id: itemId }).populate("featureId");
      // for (let i = 0; i < item.featureId.length; i++) {
      //   if (item.featureId[i]._id.toString() === feature._id.toString()) {
      //     item.featureId.pull({ _id: feature._id });
      //     await item.save();
      //   }
      // }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash("alertMessage", "Success Delete Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  //activity contorller
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "success image 404");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save();
      req.flash("alertMessage", "Success Add Activity");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash("alertMessage", "Success Update Activity");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
        req.flash("alertMessage", "Success Update Activity");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });
      // const item = await Item.findOne({ _id: itemId }).populate("featureId");
      // for (let i = 0; i < item.featureId.length; i++) {
      //   if (item.featureId[i]._id.toString() === feature._id.toString()) {
      //     item.featureId.pull({ _id: feature._id });
      //     await item.save();
      //   }
      // }
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash("alertMessage", "Success Delete Activity");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message} `);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  //controller Booking

  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate("memberId")
        .populate("itemId")
        .populate("bankId");

      res.render("admin/booking/view-booking", {
        title: "staycation | Booking",
        user: req.session.user,
        booking,
      });
    } catch (error) {
      res.redirect("/admin/booking");
    }
  },

  showDetailBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const booking = await Booking.findOne({ _id: id })
        .populate("memberId")
        .populate("bankId");

      res.render("admin/booking/show-detail-booking", {
        title: "staycation | Detail Booking",
        user: req.session.user,
        alert,
        booking,
      });
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },

  actionConfirmation: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "accept";
      await booking.save();
      req.flash("alertMessage", "Success accept payment");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },

  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "reject";
      await booking.save();
      req.flash("alertMessage", "succes rejected payments");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
};

//detailBooking
