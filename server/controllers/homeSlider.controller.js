export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No image file uploaded" 
      });
    }

    const imageUrl = `/upload/${req.file.filename}`;
    
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename: req.file.filename,
        url: imageUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image"
    });
  }
};
