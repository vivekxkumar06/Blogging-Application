import React, { useState } from "react";
import { Mail, CheckCircle, Sparkles, Send } from "lucide-react";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const { data } = await API.post("/newsletter/subscribe", { email });
      toast.success(data.message);
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 sm:p-12 lg:p-14 text-white shadow-xl">
        {/* Background decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-brand-300 border border-white/15 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Stay ahead of software shifts</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Curated engineering insights, delivered every Friday.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join over 12,000+ developers, tech leads, and systems designers. No spam,
            no algorithmic noise—just thoughtful technical writing.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="pt-4 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <div className="relative w-full">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email..."
                required
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder-slate-400 text-sm pl-10 pr-4 py-3 rounded-full border border-white/20 focus:border-white focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all shrink-0 disabled:opacity-50"
            >
              <span>{loading ? "Joining..." : "Join Free"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-[11px] text-slate-400 pt-2">
            Free forever. Unsubscribe anytime with a single click.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
