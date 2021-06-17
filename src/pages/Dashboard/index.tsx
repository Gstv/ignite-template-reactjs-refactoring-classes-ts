import { useState, useEffect } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodData, FoodFormatted } from "../../types";
import { FoodsContainer } from "./styles";

const Dashboard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodFormatted>({} as FoodFormatted);
  const [foods, setFoods] = useState<FoodFormatted[]>([]);

  useEffect(() => {
    async function loadFoods() {
      const { data } = await api.get("/foods");
  
      setFoods(data);
    }

    loadFoods();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  
  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: FoodFormatted) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  const handleAddFood = async (food: FoodData) => {
    
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodData) => {

    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
