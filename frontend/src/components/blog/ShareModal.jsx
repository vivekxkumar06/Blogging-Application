import React, { useState } from "react";
import Modal from "../common/Modal";
import { Copy, Check, Twitter, Linkedin, Facebook, MessageCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const ShareModal = ({ isOpen, onClose, title, url }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || "Check out this article on BuildNotes");

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Article link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const socialLinks = [
    {
      name: "Twitter / X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-sky-50 text-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-50 text-blue-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-indigo-50 text-indigo-600",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share this Story">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Share directly via
          </p>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-2xl border border-slate-200 transition-all font-medium text-sm text-slate-700 ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Or copy shareable link
          </p>
          <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent flex-1 text-xs text-slate-600 px-2 outline-none select-all truncate font-mono"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
