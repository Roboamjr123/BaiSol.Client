import { Button, Image, Input } from "@nextui-org/react";
import React, { ChangeEventHandler, useState } from "react";
import { useFinishTask } from "./lib/API/Project/TasksAPI";
import { toast } from "react-toastify";

const TestImage = () => {
  const submit = useFinishTask();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file from the input
    if (file) {
      setSelectedImage(file); // Set the selected image in the state
    } else {
      setSelectedImage(null); // Reset state if no file is selected
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      // Call your mutation or API function with the selected image here
      submit.mutate(
        { ProofImage: selectedImage },
        { onSuccess: (Data) => toast.success(Data) }
      );
    } else {
      console.error("No image selected");
    }
  };

  const baseURL = import.meta.env.VITE_APP_IMAGE_PROOF;

  return (
    <div>
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      <Button onClick={handleSubmit} isLoading={submit.isPending}>
        submit
      </Button>

      
      <Image src={`${baseURL}13825a48-17a9-4b14-b2d8-aea30e866055.png`} />
    </div>
  );
};

export default TestImage;
