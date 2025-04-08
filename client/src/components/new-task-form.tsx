import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { insertTaskSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = insertTaskSchema.extend({
  name: z.string().min(1, "Le nom de la tâche est requis"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewTaskForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      difficulty: 1,
      energyCost: 15,
      category: "none",
    },
  });

  // Update energy cost when difficulty changes
  useEffect(() => {
    const energyCosts = {
      1: 10, // Easy
      2: 20, // Medium
      3: 35, // Hard
    };
    
    form.setValue("energyCost", energyCosts[selectedDifficulty as 1 | 2 | 3]);
  }, [selectedDifficulty, form]);

  const createTaskMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest('POST', '/api/tasks', values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      form.reset();
      setSelectedDifficulty(1);
      toast({
        title: "Tâche créée",
        description: "Votre nouvelle tâche a été ajoutée à la liste."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de création de tâche",
        description: `${error}`,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: FormValues) => {
    createTaskMutation.mutate(values);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="font-semibold text-xl mb-4 flex items-center text-neutral-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        Ajouter une Tâche
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-600">Nom de la Tâche</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Que devez-vous faire ?"
                    {...field}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-600">Niveau de Difficulté</FormLabel>
                <div className="flex space-x-2">
                  {[1, 2, 3].map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={selectedDifficulty === level ? "default" : "outline"}
                      className={`flex-1 ${selectedDifficulty === level ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
                      onClick={() => {
                        setSelectedDifficulty(level);
                        field.onChange(level);
                      }}
                    >
                      {level === 1 ? "Facile" : level === 2 ? "Moyen" : "Difficile"}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="energyCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-600">Coût en Énergie</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <Slider
                      min={5}
                      max={50}
                      step={5}
                      value={[typeof field.value === 'number' ? field.value : 15]}
                      onValueChange={(values) => {
                        field.onChange(values[0]);
                      }}
                      className="w-full h-2 bg-neutral-200 rounded-lg"
                    />
                  </FormControl>
                  <span className="ml-2 text-secondary font-semibold min-w-[40px]">
                    {field.value || 15}%
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-600">Catégorie (Optionnel)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Sélectionner une catégorie</SelectItem>
                    <SelectItem value="work">Travail</SelectItem>
                    <SelectItem value="personal">Personnel</SelectItem>
                    <SelectItem value="health">Santé</SelectItem>
                    <SelectItem value="home">Maison</SelectItem>
                    <SelectItem value="learning">Apprentissage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            disabled={createTaskMutation.isPending}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition-colors flex items-center justify-center"
          >
            {createTaskMutation.isPending ? (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
            Ajouter la Tâche
          </Button>
        </form>
      </Form>
    </div>
  );
}
