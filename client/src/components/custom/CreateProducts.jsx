import React, { useRef, useState } from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader, Upload, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import userErrorLogout from "@/hooks/use-err-logout";
import axios from "axios";

const CreateProducts = () => {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleErrorLogout = userErrorLogout();

  const fileInputRef = useRef(null);

  const addColor = () => {
    if (!color.includes(currentColor)) {
      setColor([...color, currentColor]);
    }
  };

  const remveColor = (colorToRemove) => {
    setColor(color.filter((color) => color !== colorToRemove));
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 4;
    const availableSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, availableSlots);

    const newImages = filesToAdd.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const description = e.target.description.value;
    const price = e.target.price.value;
    const stock = e.target.stock.value;
    const category = e.target.category.value;

    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !category ||
      color.length === 0 ||
      images.length === 0
    ) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        variant: "destructive",
      });
      return;
    }

    if (
      name.trim() === "" ||
      description.trim() === "" ||
      price <= 0 ||
      stock <= 0 ||
      category.trim() === ""
    ) {
      toast({
        title: "Error",
        description: "Fields can not be empty",
        variant: "destructive",
      });
      return;
    }

    if (images.length < 4) {
      toast({
        title: "Error",
        description: "Please upload at least 4 images",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);
    color.forEach((col) => {
      formData.append("colors[]", col);
    });
    images.forEach((image) => {
      formData.append("images", image.file);
    });

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/create-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast({
        title: "Product added successfully!",
        description: res.data.message,
      });

      // ✅ Reset fields only after successful submission
      setColor([]);
      setImages([]);
      e.target.reset(); // reset form fields like name, description etc.
    } catch (error) {
      return handleErrorLogout(error, "Error uploading product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center absolute inset-0">
        <Loader className="h-12 w-12 animate-spin" />
      </div>
    );

  return (
    <div className="w-full max-w-7xl -z-10">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Add New Product
        </h2>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Enter the details for the new product you want to add to your
          e-commerce store
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmitHandle}>
        <div className=" flex flex-col lg:flex-row lg:w-[70vw]">
          <CardContent className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                rows={4}
                id="description"
                name="description"
                placeholder="Enter product description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="20"
                min="0"
                required
              />
            </div>
          </CardContent>
          <CardContent className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category">
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                  <SelectContent>
                    <SelectItem value="All">All </SelectItem>
                    <SelectItem value="Mouse">Mouse</SelectItem>
                    <SelectItem value="Keyboard">Keyboard</SelectItem>
                    <SelectItem value="Headphones">Headphones</SelectItem>
                    <SelectItem value="Sneakers">Sneakers</SelectItem>
                    <SelectItem value="Phone Chargers">
                      Phone Chargers
                    </SelectItem>
                    <SelectItem value="Power Banks">Power Banks</SelectItem>
                    <SelectItem value="Mobile Cases">Mobile Cases</SelectItem>
                    <SelectItem value="Trimmers">Trimmers</SelectItem>
                    <SelectItem value="Yoga Mats">Yoga Mats</SelectItem>
                    <SelectItem value="Office Chairs">Office Chairs</SelectItem>
                    <SelectItem value="Printed T-Shirts">
                      Printed T-Shirts
                    </SelectItem>
                    <SelectItem value="Hoodies">Hoodies</SelectItem>
                    <SelectItem value="Notebooks">Notebooks</SelectItem>
                    <SelectItem value="Pet Toys">Pet Toys</SelectItem>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="colors">Colors</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="colors"
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-12 h-12 p-1 rounded-md"
                />
                <Button variant="outline" onClick={addColor} type="button">
                  Add Color
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {color.map((col, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 dark:bg-gray-800 pl-2 rounded-full pr-1 py-1"
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: col }}
                  ></div>
                  <span className="text-sm mr-1 dark:text-gray-100">{col}</span>
                  <Button
                    variant="ghost"
                    onClick={() => remveColor(col)}
                    className="h-6 w-6 p-0 rounded-full"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove Color</span>
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                  <div className="relative" key={index}>
                    <img
                      src={image?.preview}
                      alt={`Product Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                      onClick={() => removeImage(index)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                ))}

                {images.length < 4 && (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-[100px] h-[100px]"
                    variant="outline"
                    type="button"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="sr-only">Upload Image</span>
                  </Button>
                )}
              </div>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="block mt-2"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Upload up to 4 images. Supported formats: JPG, PNG, GIF, WEBP.
              </p>
            </div>
          </CardContent>
        </div>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Adding Product..." : "Add Product"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default CreateProducts;
