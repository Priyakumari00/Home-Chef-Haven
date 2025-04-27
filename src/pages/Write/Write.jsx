import React, { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input, { TextArea } from "../../components/Input/Input";
import GlobalContext from "../../context/GlobalContext";
import "./write.css";

const Write = () => {
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    image: "",
    about: "",
    ingredients: "",
    content: "",
  });

  const {
    addNewRecipe,
    setIsLoading,
    setSnack,
    setOpenSnackBar,
    breakpoint,
  } = useContext(GlobalContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = (e) => {
    e.preventDefault();
    setNewRecipe({
      title: "",
      image: "",
      about: "",
      ingredients: "",
      content: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newRecipe.ingredients.trim()) {
      setSnack({
        text: "Please add at least one ingredient",
        bgColor: "var(--red)",
        color: "var(--white)",
      });
      setOpenSnackBar(true);
      return;
    }

    const payload = {
      ...newRecipe,
      ingredients: newRecipe.ingredients.split(",").map((i) => i.trim()),
    };

    try {
      setIsLoading(true);
      const created = await addNewRecipe(payload);
      setIsLoading(false);

      // Show success snackbar immediately
      setSnack({
        text: "Recipe published successfully!",
        bgColor: "var(--green)",
        color: "var(--white)",
      });
      setOpenSnackBar(true);

      // Navigate after small delay
      setTimeout(() => {
        navigate(`/recipe/${created._id}`);
      }, 1500); // 1.5 seconds delay
    } catch (err) {
      setIsLoading(false);
      setSnack({
        text: err?.message || "Failed to publish recipe",
        bgColor: "var(--red)",
        color: "var(--white)",
      });
      setOpenSnackBar(true);

      // Close snackbar after 4 seconds
      setTimeout(() => setOpenSnackBar(false), 4000);
    }
  };

  return (
    <main className="write">
      <section className="write-head">
        <h1>Write your own Recipe!</h1>
        {!breakpoint("mobile") && (
          <Button
            text="Publish Recipe"
            icon="save"
            onClick={handleSubmit}
          />
        )}
      </section>

      <form onSubmit={handleSubmit} onReset={handleReset}>
        <Input
          type="text"
          placeholder="Title text"
          icon="title"
          name="title"
          value={newRecipe.title}
          onChange={handleChange}
          required
        />

        <Input
          type="text"
          placeholder="Short Description"
          icon="info"
          name="about"
          value={newRecipe.about}
          onChange={handleChange}
          required
        />

        <Input
          type="url"
          placeholder="Cover Image URL"
          icon="image"
          name="image"
          value={newRecipe.image}
          onChange={handleChange}
          required
        />

        <Input
          type="text"
          placeholder="Ingredients (separate by comma)"
          icon="soup_kitchen"
          name="ingredients"
          value={newRecipe.ingredients}
          onChange={handleChange}
          required
        />

        <div className="form-flex">
          <TextArea
            type="text"
            placeholder="Recipe Content (markdown supported)"
            icon="restaurant_menu"
            name="content"
            value={newRecipe.content}
            onChange={handleChange}
            required
          />
          <div className="form-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {newRecipe.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="form-group">
          <Button text="Cancel" type="reset" variant="outline" />
          <Button text="Publish Recipe" type="submit" />
        </div>
      </form>
    </main>
  );
};

export default Write;
