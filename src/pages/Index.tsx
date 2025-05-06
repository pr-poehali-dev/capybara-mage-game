
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnatomyMarker from "@/components/AnatomyMarker";
import { Badge } from "@/components/ui/badge";

// Фразы Капибары-мага
const capybaraQuotes = [
  "Анатомия — это волшебство, а я — ваш проводник в этом магическом мире!",
  "Хм... интересный экземпляр! Мои магические силы чувствуют уникальную структуру!",
  "Внутреннее строение персонажа раскрывает его сущность!",
  "Любопытно! У этого существа весьма необычная мускулатура!",
  "Ага! Кости рассказывают мне интересную историю...",
  "Даже самые маленькие детали важны для полного анатомического анализа!",
  "Мои магические линзы видят то, что скрыто от обычных глаз!",
  "Этот персонаж обладает поистине удивительной анатомической структурой!",
  "Каждое существо уникально в своём строении. Какое чудо природы!",
  "Позвольте моей магии раскрыть тайны этого тела!"
];

// Медицинские инструменты Капибары-мага
const medicalTools = [
  { name: "Магический стетоскоп", icon: "Stethoscope", description: "Слышит биение сердца на расстоянии!" },
  { name: "Волшебная лупа", icon: "SearchCheck", description: "Увеличивает в 100 раз!" },
  { name: "Анатомометр", icon: "Ruler", description: "Измеряет магические потоки тела" },
  { name: "Костевидец", icon: "Bone", description: "Видит сквозь ткани прямо до костей" },
  { name: "Эликсир прозрения", icon: "Flask", description: "Помогает увидеть скрытые части анатомии" }
];

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [features, setFeatures] = useState<string>("");
  const [anatomyLayer, setAnatomyLayer] = useState<"surface" | "internal" | "skeletal">("surface");
  const [surfacePoints, setSurfacePoints] = useState<Array<{x: number, y: number, label: string}>>([]);
  const [internalPoints, setInternalPoints] = useState<Array<{x: number, y: number, label: string}>>([]);
  const [skeletalPoints, setSkeletalPoints] = useState<Array<{x: number, y: number, label: string}>>([]);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [currentQuote, setCurrentQuote] = useState<string>("");
  const [currentTool, setCurrentTool] = useState<typeof medicalTools[0] | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Обновление цитаты каждые 5 секунд
  useEffect(() => {
    if (analyzing || analysisComplete) {
      const interval = setInterval(() => {
        const randomQuote = capybaraQuotes[Math.floor(Math.random() * capybaraQuotes.length)];
        setCurrentQuote(randomQuote);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [analyzing, analysisComplete]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setImage(event.target.result);
          setSurfacePoints([]);
          setInternalPoints([]);
          setSkeletalPoints([]);
          setAnalysisComplete(false);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const analyzeCharacter = () => {
    if (!image || !features.trim()) return;
    
    setAnalyzing(true);
    setAnalysisComplete(false);
    
    // Устанавливаем начальную цитату
    setCurrentQuote(capybaraQuotes[Math.floor(Math.random() * capybaraQuotes.length)]);
    
    // Симуляция последовательного анализа с использованием инструментов
    const analyzeTool = (index: number) => {
      if (index >= medicalTools.length) {
        generateResults();
        return;
      }
      
      setCurrentTool(medicalTools[index]);
      
      setTimeout(() => {
        analyzeTool(index + 1);
      }, 1500);
    };
    
    // Начинаем анализ с первого инструмента
    analyzeTool(0);
    
    // Генерация результатов после анализа
    const generateResults = () => {
      // Генерация точек для каждого слоя
      if (imageRef.current) {
        const { width, height } = imageRef.current;
        
        // Слой внешних частей тела
        const surfaceLabels = ["Голова", "Плечи", "Руки", "Торс", "Ноги", "Шея"];
        const newSurfacePoints = generatePointsForLayer(width, height, surfaceLabels);
        
        // Слой внутренних органов
        const internalLabels = ["Сердце", "Легкие", "Печень", "Желудок", "Мышцы"];
        const newInternalPoints = generatePointsForLayer(width, height, internalLabels);
        
        // Слой скелета
        const skeletalLabels = ["Череп", "Позвоночник", "Ребра", "Таз", "Бедренные кости"];
        const newSkeletalPoints = generatePointsForLayer(width, height, skeletalLabels);
        
        setSurfacePoints(newSurfacePoints);
        setInternalPoints(newInternalPoints);
        setSkeletalPoints(newSkeletalPoints);
      }
      
      setAnalyzing(false);
      setAnalysisComplete(true);
      setCurrentTool(null);
    };
  };

  // Вспомогательная функция для генерации точек по слоям
  const generatePointsForLayer = (width: number, height: number, labels: string[]) => {
    const points = [];
    
    for (let i = 0; i < labels.length; i++) {
      // Расположение точек по всему изображению с разной плотностью для разных слоев
      const x = Math.floor(Math.random() * (width - 80) + 40);
      const y = Math.floor((i * (height / labels.length)) + (height / (labels.length * 2)));
      
      points.push({
        x,
        y,
        label: labels[i]
      });
    }
    
    return points;
  };

  const getActivePoints = () => {
    switch (anatomyLayer) {
      case "surface":
        return surfacePoints;
      case "internal":
        return internalPoints;
      case "skeletal":
        return skeletalPoints;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
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
              
              {/* Секция с инструментами и фразами Капибары */}
              <div className="mt-4 rounded-lg border bg-cyan-50 p-4 relative">
                {currentTool ? (
                  <div className="flex items-center space-x-3 animate-pulse">
                    <div className="p-2 bg-cyan-100 rounded-full">
                      <Icon name={currentTool.icon} className="h-6 w-6 text-cyan-700" />
                    </div>
                    <div>
                      <p className="font-medium text-cyan-900">{currentTool.name}</p>
                      <p className="text-sm text-cyan-700">{currentTool.description}</p>
                    </div>
                  </div>
                ) : currentQuote && (analyzing || analysisComplete) ? (
                  <div className="relative">
                    <Icon name="Quote" className="absolute -left-2 -top-2 h-4 w-4 text-cyan-400" />
                    <p className="italic text-cyan-800 pl-3">{currentQuote}</p>
                  </div>
                ) : (
                  <p className="text-cyan-800">Капибара-маг ждет ваших данных для анализа...</p>
                )}
              </div>
              
              {/* Отображение медицинских инструментов */}
              {analysisComplete && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {medicalTools.map((tool) => (
                    <Badge 
                      key={tool.name} 
                      variant="secondary" 
                      className="flex items-center gap-1 py-1.5"
                    >
                      <Icon name={tool.icon} className="h-3 w-3" />
                      <span className="text-xs">{tool.name}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {analysisComplete && (
                <Tabs defaultValue="surface" onValueChange={(v) => setAnatomyLayer(v as any)}>
                  <TabsList className="grid grid-cols-3 mb-2">
                    <TabsTrigger value="surface">Внешний слой</TabsTrigger>
                    <TabsTrigger value="internal">Внутренние органы</TabsTrigger>
                    <TabsTrigger value="skeletal">Скелет</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              <div className="relative bg-gray-100 rounded-lg overflow-hidden min-h-[400px] flex items-center justify-center">
                {image ? (
                  <div className="relative w-full h-full">
                    <img 
                      ref={imageRef}
                      src={image} 
                      alt="Загруженный персонаж" 
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Анатомические маркеры для выбранного слоя */}
                    {analysisComplete && getActivePoints().map((point, index) => (
                      <AnatomyMarker
                        key={index}
                        x={point.x}
                        y={point.y}
                        label={point.label}
                        className={anatomyLayer === "surface" ? "text-cyan-600" : 
                                 anatomyLayer === "internal" ? "text-rose-600" : "text-amber-600"}
                      />
                    ))}
                    
                    {/* Анимация активного инструмента */}
                    {analyzing && currentTool && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-full h-full bg-white opacity-30"></div>
                        <div className="z-10 p-4 bg-cyan-100 rounded-full animate-bounce">
                          <Icon name={currentTool.icon} className="h-12 w-12 text-cyan-700" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Icon name="Upload" className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Загрузите изображение персонажа</p>
                  </div>
                )}
              </div>
              
              {analysisComplete && (
                <div className="flex justify-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${anatomyLayer === "surface" ? "bg-cyan-500" : "bg-cyan-200"}`}></div>
                  <div className={`h-3 w-3 rounded-full ${anatomyLayer === "internal" ? "bg-rose-500" : "bg-rose-200"}`}></div>
                  <div className={`h-3 w-3 rounded-full ${anatomyLayer === "skeletal" ? "bg-amber-500" : "bg-amber-200"}`}></div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="bg-indigo-50 p-4 border-t text-center text-indigo-700 text-sm">
            <p className="w-full">
              Капибара-маг изучит анатомию вашего персонажа на трех уровнях: внешний вид, внутренние органы и скелет! ✨
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
