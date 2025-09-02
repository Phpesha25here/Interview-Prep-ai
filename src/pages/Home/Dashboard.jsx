import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SummaryCard from "../../components/cards/summaryCard";
import moment from "moment";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";

// ✅ Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[400px] max-w-[90%] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✖
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [session, setSession] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // ✅ Fetch all sessions
  const fetchAllSessions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      const sessions = response.data?.data || response.data || [];
      setSession(Array.isArray(sessions) ? sessions : []);
    } catch (error) {
      console.error("Error fetching session data:", error);
      toast.error("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete a session
  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({ open: false, data: null });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:", error);
      toast.error("Failed to delete session");
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading sessions...</p>
        ) : session.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No sessions available. Click the button below to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0">
            {session.map((data, index) => (
              <SummaryCard
                key={data._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data.role || ""}
                topicsToFocus={data.topicsToFocus || ""}
                experience={data.experience || "-"}
                questions={data.questions?.length || "-"}
                description={data.description || ""}
                lastUpdated={
                  data.updatedAt ? moment(data.updatedAt).format("Do MMM YYYY") : ""
                }
                onSelect={() => navigate(`/interview-prep/${data._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <button
          className="h-12 md:h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>
      </div>

<Modal
  isOpen={openDeleteAlert.open}
  onClose={() => setOpenDeleteAlert({ open: false, data: null })}
  title="Delete Alert"
>
  <DeleteAlertContent
    content="Are you sure you want to delete this session detail?"
    onDelete={() => deleteSession(openDeleteAlert.data)}
    onCancel={() => setOpenDeleteAlert({ open: false, data: null })}
  />
</Modal>


      {/* Create New Session Modal */}
      {openCreateModal && (
        <Modal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          title="Create New Session"
        >
          <CreateSessionForm />
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
