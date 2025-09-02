import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu';
import { toast } from "react-hot-toast";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RoleInHeader from '../../components/RoleInHeader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import QuestionCard from '../../components/cards/QuestionCard';
import AIResponsePreview from '../../components/AIResponsePreview';
import Drawer from '../../components/Drawer';
import SkeletonLoader from '../../components/loader/SkeletonLoader';
import SpinnerLoader from '../../components/loader/SpinnerLoader';

const Interviewprep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);

  // loaders separated clearly
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const [explanation, setExplanation] = useState(null);

  // Fetch session data
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate explanation (debounced)
  const generateConceptExplanation = async (question) => {
    if (isLoadingExplanation) return; // prevent spam clicks
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoadingExplanation(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { question });
      if (response.data) setExplanation(response.data);
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation, try again later.");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // Pin toggle (optimistic UI)
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      setSessionData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === questionId ? { ...q, ispinned: !q.ispinned } : q
        ),
      }));

      await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));
    } catch (error) {
      toast.error("Failed to update pin status");
      fetchSessionDetailsById(); // rollback
    }
  };

  // Load more questions (with duplicate filter)
  const uploadMoreQuestions = async () => {
    try {
      setIsLoadingQuestions(true);

      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role || "Software Engineer",   // ✅ fallback defaults
        experience: sessionData?.experience || "0-1 years",
        topicsToFocus: sessionData?.topicsToFocus || "General",
        numberOfQuestions: 10, // ✅ fixed key
      });

      const generatedQuestions = aiResponse.data;
      const existingQuestions = sessionData?.questions?.map(q => q.question) || [];

      const uniqueQuestions = generatedQuestions.filter(
        (q) => !existingQuestions.includes(q.question)
      );

      if (uniqueQuestions.length === 0) {
        toast.error("No new unique questions generated.");
        return;
      }

      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: uniqueQuestions,
      });

      if (response.data) {
        toast.success("Added More Q&A!");
        fetchSessionDetailsById();
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSessionDetailsById();
  }, [sessionId]);

  return (
    <DashboardLayout>
      <RoleInHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={sessionData?.updatedAt ? moment(sessionData.updatedAt).format("Do MMM YYYY") : ""}
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 m-10">
          <div className="col-span-12 md:col-span-8">
            <AnimatePresence>
              {sessionData?.questions?.length ? (
                sessionData?.questions
                  ?.slice()
                  .sort((a, b) => (a.ispinned && !b.ispinned ? -1 : !a.ispinned && b.ispinned ? 1 : 0))
                  .map((data, index) => (
                    <motion.div
                      key={data._id || index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                        delay: index * 0.1,
                        damping: 15,
                      }}
                      layout
                      layoutId={`question-${data._id || index}`}
                    >
                      <QuestionCard
                        question={data?.question}
                        answer={data?.answer}
                        onLearnMore={() => generateConceptExplanation(data.question)}
                        isPinned={data?.ispinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />

                      {/* Load More button at the end */}
                      {sessionData?.questions?.length === index + 1 && (
                        <div className="flex items-center justify-center mt-5">
                          <button
                            className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded cursor-pointer"
                            disabled={isLoadingQuestions}
                            onClick={uploadMoreQuestions}
                          >
                            {isLoadingQuestions ? <SpinnerLoader /> : <LuListCollapse className="text-lg" />}
                            Load More
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
              ) : (
                <p className="text-center text-gray-500 mt-10">
                  No questions yet. Try loading some!
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Drawer overlays */}
        <Drawer
          isOpen={openLeanMoreDrawer}
          onClose={() => setOpenLeanMoreDrawer(false)}
          title={!isLoadingExplanation && explanation?.title}
        >
          {errorMsg && (
            <p className="flex gap-2 text-sm text-amber-600 font-medium">
              <LuCircleAlert className="mt-1" /> {errorMsg}
            </p>
          )}
          {isLoadingExplanation && <SkeletonLoader />}
          {!isLoadingExplanation && explanation && (
            <AIResponsePreview content={explanation?.explanation} />
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default Interviewprep;
