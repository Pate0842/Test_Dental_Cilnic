import { Service } from "../models/serviceSchema.js";
import { ServiceLeaf } from "../core/ServiceLeaf.js";
import { ServicePackageComposite } from "../core/ServicePackageComposite.js";

// Tạo dịch vụ riêng lẻ
export const createService = async (req, res) => {
  try {
    const { serviceName, description, cost } = req.body;

    const existingService = await Service.findOne({ serviceName });
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: "Dịch vụ này đã tồn tại!",
      });
    }

    const newService = new Service({ serviceName, description, cost });
    await newService.save();

    const serviceLeaf = new ServiceLeaf(newService);

    res.status(201).json({
      success: true,
      message: "Dịch vụ mới đã được tạo thành công!",
      service: serviceLeaf.getDetails(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể tạo dịch vụ.",
      error: error.message,
    });
  }
};

// Tạo gói dịch vụ
export const createServicePackage = async (req, res) => {
  try {
    const { packageName, serviceIds } = req.body;

    const services = await Service.find({ _id: { $in: serviceIds } });
    if (services.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: "Một hoặc nhiều dịch vụ không tồn tại!",
      });
    }

    const servicePackage = new ServicePackageComposite(packageName);
    services.forEach((service) => servicePackage.add(new ServiceLeaf(service)));

    res.status(201).json({
      success: true,
      message: "Gói dịch vụ đã được tạo thành công!",
      package: servicePackage.getDetails(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể tạo gói dịch vụ.",
      error: error.message,
    });
  }
};

// Lấy danh sách tất cả các dịch vụ (chỉ dịch vụ riêng lẻ)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    const serviceLeaves = services.map((service) => new ServiceLeaf(service));

    res.status(200).json({
      success: true,
      message: "Danh sách dịch vụ đã được lấy thành công!",
      services: serviceLeaves.map((leaf) => leaf.getDetails()),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể lấy danh sách dịch vụ.",
      error: error.message,
    });
  }
};

// Lấy dịch vụ theo ID (hỗ trợ cả dịch vụ riêng lẻ)
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không tồn tại!",
      });
    }

    const serviceLeaf = new ServiceLeaf(service);

    res.status(200).json({
      success: true,
      message: "Dịch vụ đã được lấy thành công!",
      service: serviceLeaf.getDetails(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể lấy dịch vụ.",
      error: error.message,
    });
  }
};

// Cập nhật dịch vụ (chỉ áp dụng cho dịch vụ riêng lẻ)
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedService = await Service.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không tồn tại!",
      });
    }

    const serviceLeaf = new ServiceLeaf(updatedService);

    res.status(200).json({
      success: true,
      message: "Dịch vụ đã được cập nhật thành công!",
      updatedService: serviceLeaf.getDetails(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể cập nhật dịch vụ.",
      error: error.message,
    });
  }
};

// Xóa (ngừng kích hoạt) dịch vụ (chỉ áp dụng cho dịch vụ riêng lẻ)
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Dịch vụ không tồn tại!",
      });
    }

    const serviceLeaf = new ServiceLeaf(deletedService);

    res.status(200).json({
      success: true,
      message: "Dịch vụ đã được ngừng kích hoạt!",
      deletedService: serviceLeaf.getDetails(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể xóa dịch vụ.",
      error: error.message,
    });
  }
};