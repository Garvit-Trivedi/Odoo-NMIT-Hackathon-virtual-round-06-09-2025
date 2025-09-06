export const uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
    const files = req.files.map(f => ({ filename: f.filename, path: `/uploads/${f.filename}` }));
    res.json({ files });
  } catch (err) {
    console.error('upload error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
