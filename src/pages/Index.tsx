
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [features, setFeatures] = useState<string>("");
  const [anatomyPoints, setAnatomyPoints] = useState<Array<{x: number, y: number, label: string}>>([]);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setImage(event.target.result);
          setAnatomyPoints([]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const analyzeCharacter = () => {
    if (!image || !features.trim()) return;
    
    setAnalyzing(true);
    
    // Симуляция обработки с отложенным ответом
    setTimeout(() => {
      // Генерируем случайные точки для разметки анатомии
      const generateRandomPoints = () => {
        const points = [];
        const anatomyParts = ["Голова", "Плечи", "Руки", "Торс", "Ноги"];
        
        if (imageRef.current) {
          const { width, height } = imageRef.current;
          
          for (let i = 0; i < 5; i++) {
            points.push({
              x: Math.floor(Math.random() * (width - 50) + 25),
              y: Math.floor(i * (height / 5) + (height / 10)),
              label: anatomyParts[i]
            });
          }
        }
        
        return points;
      };
      
      setAnatomyPoints(generateRandomPoints());
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border border-indigo-100">
          <CardHeader className="text-center bg-gradient-to-r from-teal-400 to-cyan-300 rounded-t-lg">
            <div className="w-24 h-24 mx-auto bg-white rounded-full overflow-hidden border-4 border-white shadow-md mb-2">
              <img 
                src="https://cdn.poehali.dev/files/7b35d46a-5f81-4112-8d02-8f82a3fc613b.png" 
                alt="Капибара-маг" 
                className="w-full h-full object-cover"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-indigo-900">Анатомия персонажа от Капибары-мага</CardTitle>
            <CardDescription className="text-indigo-800">
              Загрузите изображение вашего персонажа в полный рост и опишите его особенности
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Изображение персонажа</Label>
                <div className="flex gap-4 items-center">
                  <Input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="features">Особенности персонажа</Label>
                <Textarea 
                  id="features" 
                  placeholder="Опишите особенности вашего персонажа (телосложение, пропорции, экипировка и т.д.)" 
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="resize-none h-32"
                />
              </div>
              
              <Button 
                onClick={analyzeCharacter}
                disabled={!image || !features.trim() || analyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {analyzing ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Капибара анализирует...
                  </>
                ) : (
                  <>
                    <Icon name="Wand2" className="mr-2 h-4 w-4" />
                    Изучить анатомию
                  </>
                )}
              </Button>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg overflow-hidden min-h-[300px] flex items-center justify-center">
              {image ? (
                <div className="relative w-full h-full">
                  <img 
                    ref={imageRef}
                    src={image} 
                    alt="Загруженный персонаж" 
                    className="w-full h-full object-contain"
                  />
                  {anatomyPoints.map((point, index) => (
                    <div 
                      key={index}
                      className="absolute animate-pulse"
                      style={{ 
                        left: `${point.x}px`, 
                        top: `${point.y}px`,
                      }}
                    >
                      <div className="w-4 h-4 bg-cyan-500 rounded-full relative">
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-white px-2 py-1 rounded text-xs font-semibold shadow-md whitespace-nowrap">
                          {point.label}
                        </div>
                        <div className="absolute w-0.5 h-12 bg-cyan-500 left-1/2 transform -translate-x-1/2 -bottom-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">
                  <Icon name="Upload" className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Загрузите изображение персонажа</p>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="bg-indigo-50 p-4 border-t text-center text-indigo-700 text-sm">
            <p className="w-full">
              Капибара-маг изучит анатомию вашего персонажа и поделится своей магической мудростью! ✨
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
