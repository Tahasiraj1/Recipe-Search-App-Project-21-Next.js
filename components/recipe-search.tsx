"use client";
import React, { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { SearchIcon, Utensils } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";


interface Recipe {
    uri: string;
    label: string;
    image: string;
    ingredientLines: string[];
    ingredients: { text: string }[];
    url: string;
};

const examples = [ 
    "Biryani",
    "Chicken Karahi",
    "Nihari",
    "Haleem",
    "Chapli Kabab",
 ];


export default function RecipeSearch() {
    const [query, setQuery] = useState<string>("");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searched, setSearched] = useState<boolean>(false);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        setRecipes([]);
        try {
            const response = await fetch(
                `https://api.edamam.com/search?q=${query}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`
            );
            const data = await response.json();
            setRecipes(data.hits.map((hit: { recipe: Recipe }) => hit.recipe));
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-100 flex flex-col h-full w-full max-w-6xl mx-auto p-4 md:p-6">
            {/* Header section */}
            <header className="flex flex-col items-center mb-6">
                <h1 className="flex items-center text-3xl font-bold mb-2">
                    <Utensils className="mr-2" />Recipe Search
                </h1>
                <p className="text-lg mb-4">
                    Find delicious recipes by ingredients you have at home.
                </p>
                {/* Example search terms */}
                <div className="mb-4">
                    <p>Try Searching for:</p>
                    <div className="flex space-x-2">
                        {examples.map((example) => (
                            <span
                            key={example}
                            className="px-2 py-1 bg-gray-200 rounded-md cursor-pointer"
                            onClick={() => setQuery(example)}
                            >
                                {example}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Search form */}
                <form className="relative w-full max-w-md mb-6"
                onSubmit={handleSearch}>
                    <Input
                    type="search"
                    placeholder="Search by ingredient..."
                    className="pr-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    >
                        <SearchIcon className="w-5 h-5 active:scale-90 transition-transform transform duration-300" />
                    </Button>
                </form>
            </header>
            {/* Loading spinner */}
            {loading ? (
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <ClipLoader className="w-10 h-10 mb-4" />
                    <p>Loading redipes, please wait...</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Message for no recipes found */}
                    {searched && recipes.length === 0 && (
                        <p>No recipes found. Try searching with different ingredients.</p>
                    )}
                    {/* Display list of recipes */}
                    {recipes.map((recipe) => (
                        <Card className="group relative shadow-lg"
                        key={recipe.uri}>
                            <Image
                            src={recipe.image}
                            alt={recipe.label}
                            width={400}
                            height={300}
                            className="rounded-t-lg object-cover w-full h-48 group-hover:opacity-50 transition-opacity"
                            />
                            <CardContent className="p-4">
                                <h2 className="text-xl font-bold mb-2">{recipe.label}</h2>
                                <p className="text-muted-foreground line-clamp-2">
                                    {recipe.ingredientLines.join(", ")}
                                </p>
                            </CardContent>
                            <Link
                            href={recipe.url}
                            className="absolute inset-0 z-10"
                            prefetch={false}
                            >
                                <span className="sr-only">View Recipe</span>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}