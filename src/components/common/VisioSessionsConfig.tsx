"use client";

import {
  useGetProExpert,
  useUpdateProExpert,
} from "@/api/proExpert/useProExpert";
import { Button } from "@/components/common/Button";
import { Switch } from "@/components/ui/switch";
import { useProSessionsConfig } from "@/hooks/useProSessionsConfig";
import { Check, Pencil, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface VisioSessionsConfigProps {
  className?: string;
}

interface ExtraData {
  questions: string[];
  expectations: string[];
}

export default function VisioSessionsConfig({
  className,
}: VisioSessionsConfigProps) {
  const t = useTranslations();
  const updateProExpertMutation = useUpdateProExpert();
  const { data: proExpertData } = useGetProExpert();

  const {
    sessions,
    isInitialLoading,
    error,
    isSaving: isSavingSessions,
    hasUnsavedChanges,
    handlePriceChange,
    handleToggle,
    saveSessions,
  } = useProSessionsConfig();

  // État pour les données personnalisées
  const [customData, setCustomData] = useState<ExtraData>({
    questions: [],
    expectations: [],
  });
  const [isEditingQuestions, setIsEditingQuestions] = useState(false);
  const [isEditingExpectations, setIsEditingExpectations] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Charger les données depuis extra_data du profil pro
  useEffect(() => {
    if (proExpertData?.extra_data) {
      try {
        const parsed = JSON.parse(proExpertData.extra_data);
        if (parsed.questions && parsed.expectations) {
          setCustomData({
            questions: parsed.questions || [],
            expectations: parsed.expectations || [],
          });
        }
      } catch (e) {
        console.error("Erreur lors du parsing de extra_data:", e);
      }
    }
  }, [proExpertData]);

  // Utiliser directement les données personnalisées
  const expectations = customData.expectations;
  const questionExamples = customData.questions;

  // Fonction pour sauvegarder extra_data dans le profil pro
  const saveExtraData = async (data: ExtraData) => {
    if (!proExpertData) {
      console.error("Aucun profil pro trouvé pour sauvegarder extra_data");
      return;
    }

    setIsSaving(true);
    try {
      const extraDataString = JSON.stringify(data);
      await updateProExpertMutation.mutateAsync({
        extra_data: extraDataString,
      });
      setCustomData(data);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Fonctions pour gérer les questions
  const handleAddQuestion = () => {
    const newQuestions = [...customData.questions, ""];
    const newData = { ...customData, questions: newQuestions };
    setCustomData(newData);
    setIsEditingQuestions(true);
    setEditingIndex(newQuestions.length - 1);
    setEditingValue("");
  };

  const handleEditQuestion = (index: number) => {
    setEditingIndex(index);
    setEditingValue(customData.questions[index]);
    setIsEditingQuestions(true);
  };

  const handleSaveQuestion = async (index: number) => {
    if (editingValue.trim()) {
      const newQuestions = [...customData.questions];
      newQuestions[index] = editingValue.trim();
      const newData = { ...customData, questions: newQuestions };
      await saveExtraData(newData);
    }
    setEditingIndex(null);
    setEditingValue("");
    setIsEditingQuestions(false);
  };

  const handleDeleteQuestion = async (index: number) => {
    const newQuestions = customData.questions.filter((_, i) => i !== index);
    const newData = { ...customData, questions: newQuestions };
    await saveExtraData(newData);
  };

  // Fonctions pour gérer les expectations
  const handleAddExpectation = () => {
    const newExpectations = [...customData.expectations, ""];
    const newData = { ...customData, expectations: newExpectations };
    setCustomData(newData);
    setIsEditingExpectations(true);
    setEditingIndex(newExpectations.length - 1);
    setEditingValue("");
  };

  const handleEditExpectation = (index: number) => {
    setEditingIndex(index);
    setEditingValue(customData.expectations[index]);
    setIsEditingExpectations(true);
  };

  const handleSaveExpectation = async (index: number) => {
    if (editingValue.trim()) {
      const newExpectations = [...customData.expectations];
      newExpectations[index] = editingValue.trim();
      const newData = { ...customData, expectations: newExpectations };
      await saveExtraData(newData);
    }
    setEditingIndex(null);
    setEditingValue("");
    setIsEditingExpectations(false);
  };

  const handleDeleteExpectation = async (index: number) => {
    const newExpectations = customData.expectations.filter(
      (_, i) => i !== index
    );
    const newData = { ...customData, expectations: newExpectations };
    await saveExtraData(newData);
  };

  // Loading initial seulement si on n'a pas encore de données
  if (isInitialLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-600">
            {t("visioSessionsConfig.loadingSessions")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 w-full ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">
            {t("visioSessionsConfig.loadingError")}
          </p>
        </div>
      )}

      {/* Indicateur de sauvegarde */}
      {isSaving && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-blue-700 text-sm font-medium">
            {t("visioSessionsConfig.saving")}
          </p>
        </div>
      )}

      {/* Configuration des sessions */}
      <div className="space-y-4">
        {sessions.map((session) => {
          return (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 bg-white rounded-[12px] border border-light-blue-gray ${
                isSavingSessions ? "opacity-70" : ""
              } transition-opacity duration-200`}
            >
              <div className="flex items-center gap-6">
                <span className="text-lg font-bold text-slate-900 min-w-[100px]">
                  {session.duration}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {t("visioSessionsConfig.price")}
                  </span>
                  <input
                    type="number"
                    value={session.price}
                    onChange={(e) =>
                      handlePriceChange(
                        session.id,
                        parseInt(e.target.value) || 0
                      )
                    }
                    disabled={!session.enabled || isSavingSessions}
                    className={`w-16 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      session.enabled && !isSavingSessions
                        ? "border-gray-300 bg-white text-gray-900"
                        : "border-gray-200 bg-gray-50 text-gray-400"
                    }`}
                  />
                  <span className="text-gray-500">€</span>
                </div>
              </div>

              <Switch
                checked={session.enabled}
                onCheckedChange={(checked) => {
                  handleToggle(session.id, checked);
                }}
                disabled={isSavingSessions}
                className="data-[state=checked]:bg-gray-900"
              />
            </div>
          );
        })}
      </div>

      <Button
        label={
          isSavingSessions
            ? t("visioSessionsConfig.saving")
            : t("visioSessionsConfig.save")
        }
        onClick={() => saveSessions()}
        disabled={!hasUnsavedChanges || isSavingSessions}
        className="w-full text-white font-bold h-[44px]"
      />

      {/* Section Attentes */}
      <div className="space-y-4 border border-light-blue-gray pt-4 rounded-[8px] px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-normal text-slate-gray flex-shrink-0">
            {t("visioSessionsConfig.expectations")}
          </h3>
          <button
            onClick={handleAddExpectation}
            disabled={isSaving}
            className="flex items-center gap-1 text-xs text-exford-blue hover:text-exford-blue/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
            {t("visioSessionsConfig.add")}
          </button>
        </div>
        <div className="space-y-2 pl-2 w-full">
          {expectations.length === 0 ? (
            <p className="text-gray-500 text-sm font-figtree italic">
              {t("visioSessionsConfig.noExpectationsAvailable")}
            </p>
          ) : (
            <>
              {expectations.map((expectation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 group w-full"
                >
                  <div className="w-1 h-1 bg-exford-blue rounded-full mt-2 flex-shrink-0"></div>
                  {isEditingExpectations && editingIndex === index ? (
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isSaving) {
                            handleSaveExpectation(index);
                          } else if (e.key === "Escape" && !isSaving) {
                            setEditingIndex(null);
                            setEditingValue("");
                            setIsEditingExpectations(false);
                          }
                        }}
                        disabled={isSaving}
                        className="flex-1 min-w-0 px-2 py-1 text-base text-exford-blue border border-exford-blue rounded focus:outline-none focus:ring-2 focus:ring-exford-blue disabled:opacity-50 disabled:cursor-not-allowed"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveExpectation(index)}
                        disabled={isSaving}
                        className="p-1 text-exford-blue hover:bg-exford-blue/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          setEditingValue("");
                          setIsEditingExpectations(false);
                        }}
                        disabled={isSaving}
                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
                      <p
                        className="text-base text-exford-blue break-words pr-2"
                        style={{
                          flex: "1 1 0",
                          minWidth: 0,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {expectation}
                      </p>
                      {isEditingExpectations && (
                        <div
                          className="flex items-center gap-1 flex-shrink-0 ml-auto"
                          style={{ marginTop: "2px" }}
                        >
                          <button
                            onClick={() => handleEditExpectation(index)}
                            disabled={isSaving}
                            className="p-1 text-exford-blue hover:bg-exford-blue/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpectation(index)}
                            disabled={isSaving}
                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isEditingExpectations && (
                <button
                  onClick={() => {
                    setIsEditingExpectations(false);
                    setEditingIndex(null);
                    setEditingValue("");
                  }}
                  disabled={isSaving}
                  className="text-xs text-slate-gray hover:text-exford-blue mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("visioSessionsConfig.finishEditing")}
                </button>
              )}
            </>
          )}
        </div>
        {!isEditingExpectations && expectations.length > 0 && (
          <button
            onClick={() => setIsEditingExpectations(true)}
            disabled={isSaving}
            className="flex items-center gap-1 text-xs text-slate-gray hover:text-exford-blue mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pencil className="w-3 h-3" />
            {t("visioSessionsConfig.edit")}
          </button>
        )}
      </div>

      {/* Section Exemples de questions */}
      <div className="space-y-4 border border-light-blue-gray pt-4 rounded-[8px] px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-normal text-slate-gray flex-shrink-0">
            {t("visioSessionsConfig.questionExamples")}
          </h3>
          <button
            onClick={handleAddQuestion}
            disabled={isSaving}
            className="flex items-center gap-1 text-xs text-exford-blue hover:text-exford-blue/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
            {t("visioSessionsConfig.add")}
          </button>
        </div>
        <div className="space-y-2 pl-2 w-full">
          {questionExamples.length === 0 ? (
            <p className="text-gray-500 text-sm font-figtree italic">
              {t("visioSessionsConfig.noQuestionsAvailable")}
            </p>
          ) : (
            <>
              {questionExamples.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 group w-full"
                >
                  <div className="w-1 h-1 bg-exford-blue rounded-full mt-2 flex-shrink-0"></div>
                  {isEditingQuestions && editingIndex === index ? (
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isSaving) {
                            handleSaveQuestion(index);
                          } else if (e.key === "Escape" && !isSaving) {
                            setEditingIndex(null);
                            setEditingValue("");
                            setIsEditingQuestions(false);
                          }
                        }}
                        disabled={isSaving}
                        className="flex-1 min-w-0 px-2 py-1 text-base text-exford-blue border border-exford-blue rounded focus:outline-none focus:ring-2 focus:ring-exford-blue disabled:opacity-50 disabled:cursor-not-allowed"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveQuestion(index)}
                        disabled={isSaving}
                        className="p-1 text-exford-blue hover:bg-exford-blue/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingIndex(null);
                          setEditingValue("");
                          setIsEditingQuestions(false);
                        }}
                        disabled={isSaving}
                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
                      <p
                        className="text-base text-exford-blue break-words pr-2"
                        style={{
                          flex: "1 1 0",
                          minWidth: 0,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {question}
                      </p>
                      {isEditingQuestions && (
                        <div
                          className="flex items-center gap-1 flex-shrink-0 ml-auto"
                          style={{ marginTop: "2px" }}
                        >
                          <button
                            onClick={() => handleEditQuestion(index)}
                            disabled={isSaving}
                            className="p-1 text-exford-blue hover:bg-exford-blue/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            disabled={isSaving}
                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isEditingQuestions && (
                <button
                  onClick={() => {
                    setIsEditingQuestions(false);
                    setEditingIndex(null);
                    setEditingValue("");
                  }}
                  disabled={isSaving}
                  className="text-xs text-slate-gray hover:text-exford-blue mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("visioSessionsConfig.finishEditing")}
                </button>
              )}
            </>
          )}
        </div>
        {!isEditingQuestions && questionExamples.length > 0 && (
          <button
            onClick={() => setIsEditingQuestions(true)}
            disabled={isSaving}
            className="flex items-center gap-1 text-xs text-slate-gray hover:text-exford-blue mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pencil className="w-3 h-3" />
            {t("visioSessionsConfig.edit")}
          </button>
        )}
      </div>
    </div>
  );
}
