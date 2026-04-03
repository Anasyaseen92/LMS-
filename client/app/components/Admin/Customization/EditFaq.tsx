import { styles } from "@/app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";

type FaqItem = {
  _id?: string;
  question: string;
  answer: string;
  active?: boolean;
};

type LayoutResponse = {
  layout?: {
    faq?: FaqItem[];
  };
};

type ApiError = {
  data?: {
    message?: string;
  };
};

const EditFaq = () => {
  const { data, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  }) as {
    data?: LayoutResponse;
    refetch: () => void;
  };
  const [
    editLayout,
    { isLoading, isSuccess: layoutSuccess, error },
  ] = useEditLayoutMutation();

  const [questions, setQuestions] = useState<FaqItem[]>([]);

  useEffect(() => {
    if (data) {
      const syncFaqState = window.setTimeout(() => {
        setQuestions(data.layout?.faq || []);
      }, 0);

      return () => window.clearTimeout(syncFaqState);
    }
    if (layoutSuccess) {
      refetch();
      toast.success("Faq-updated successfully!");
    }
    if (error) {
      const errorData = error as ApiError;
      toast.error(errorData.data?.message || "Failed to update FAQ");
    }
  }, [data, layoutSuccess, error, refetch]);

  const toggleQuestion = (id?: string) => {
    setQuestions((prevQuestion) =>
      prevQuestion.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: string | undefined, value: string) => {
    setQuestions((prevQuestion) =>
      prevQuestion.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: string | undefined, value: string) => {
    setQuestions((prevQuestion) =>
      prevQuestion.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        _id: `new-${crypto.randomUUID()}`,
        question: "",
        answer: "",
        active: true,
      },
    ]);
  };

  const areQuestionsUnchanged = (
    originalQuestions: FaqItem[] = [],
    newQuestions: FaqItem[] = []
  ) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (faqItems: FaqItem[]) => {
    return faqItems.some((q) => q.question === "" || q.answer === "");
  };

  const currentFaq = data?.layout?.faq || [];

  const handleEdit = async () => {
    if (!areQuestionsUnchanged(currentFaq, questions) && !isAnyQuestionEmpty(questions)) {
      await editLayout({
        type: "FAQ",
        faq: questions,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
          <div className="mt-12">
            <dl className="space-y-8">
              {questions?.map((q) => (
                <div
                  key={q._id}
                  className={`${
                    q._id !== questions[0]?._id && "border-t"
                  } border-gray-200 pt-6`}
                >
                  <dt className="text-lg">
                    <button
                      type="button"
                      className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                      onClick={() => toggleQuestion(q._id)}
                    >
                      <input
                        className={`${styles.input} border-none`}
                        value={q.question}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleQuestionChange(q._id, e.target.value)
                        }
                        placeholder="Add your question..."
                      />

                      <span className="ml-6 flex-shrink-0">
                        {q.active ? (
                          <HiMinus className="h-6 w-6" />
                        ) : (
                          <HiPlus className="h-6 w-6" />
                        )}
                      </span>
                    </button>
                  </dt>
                  {q.active && (
                    <dd className="mt-2 pr-12">
                      <input
                        className={`${styles.input} border-none`}
                        value={q.answer}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleAnswerChange(q._id, e.target.value)
                        }
                        placeholder="Add your answer..."
                      />
                      <span className="ml-6 flex-shrink-0">
                        <AiOutlineDelete
                          className="dark:text-white text-black text-[18px] cursor-pointer"
                          onClick={() => {
                            setQuestions((prevQuestions) =>
                              prevQuestions.filter((item) => item._id !== q._id)
                            );
                          }}
                        />
                      </span>
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <br />
            <br />
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newFaqHandler}
            />
          </div>
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
              ${
                areQuestionsUnchanged(currentFaq, questions) || isAnyQuestionEmpty(questions)
                  ? "!cursor-not-allowed"
                  : "!cursor-pointer !bg-[#42d383]"
              }
              !rounded fixed bottom-12 right-12`}
            onClick={
              areQuestionsUnchanged(currentFaq, questions) || isAnyQuestionEmpty(questions)
                ? () => null
                : handleEdit
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;
