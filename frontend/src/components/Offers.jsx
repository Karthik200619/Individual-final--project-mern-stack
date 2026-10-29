import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { FaHandshake, FaSpinner, FaCheckCircle, FaTimesCircle, FaArrowRight } from 'react-icons/fa';
import { showToast } from '../utils/toast';

const API = 'https://individual-final-project-mern-stack.onrender.com/user-api';

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function Offers() {
  const navigate = useNavigate();
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [counterPrices, setCounterPrices] = useState({});
  const [busyId, setBusyId] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [mine, incoming] = await Promise.all([
        axios.get(`${API}/offers/mine`, { withCredentials: true }),
        axios.get(`${API}/seller/offers`, { withCredentials: true }),
      ]);
      setSent(mine.data.payload || []);
      setReceived(incoming.data.payload || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not load offers', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const respond = async (offer, action) => {
    setBusyId(offer._id);
    try {
      const counterPrice = Number(counterPrices[offer._id]);
      if (action === 'counter' && (!Number.isFinite(counterPrice) || counterPrice <= 0)) {
        showToast('Enter a valid counter-offer price.', 'error');
        return;
      }
      await axios.patch(`${API}/offers/${offer._id}/respond`, {
        action,
        ...(action === 'counter' ? { counterPrice } : {}),
      }, { withCredentials: true });
      showToast(action === 'counter' ? 'Counter-offer sent to buyer.' : `Offer ${action === 'accept' ? 'accepted' : 'rejected'}.`, 'success');
      await refresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update offer', 'error');
    } finally {
      setBusyId('');
    }
  };

  const acceptCounter = async (offer) => {
    setBusyId(offer._id);
    try {
      await axios.patch(`${API}/offers/${offer._id}/accept-counter`, {}, { withCredentials: true });
      showToast('Counter-offer accepted. You can check out at the agreed price.', 'success');
      await refresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not accept counter-offer', 'error');
    } finally {
      setBusyId('');
    }
  };

  const OfferCard = ({ offer, incoming }) => {
    const item = offer.item || {};
    const otherParty = incoming ? offer.buyer : offer.seller;
    const statusClass = offer.status === 'accepted' || offer.status === 'completed'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
      : offer.status === 'rejected'
        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300';

    return (
      <article key={offer._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex gap-3">
          <img src={item.coverImage || 'https://via.placeholder.com/96'} alt="" className="h-20 w-20 rounded-xl bg-slate-100 object-cover dark:bg-slate-800" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <button onClick={() => item._id && navigate(`/item/${item._id}`)} className="text-left font-bold text-slate-900 hover:text-indigo-600 dark:text-white">
                {item.title || 'Listing no longer available'}
              </button>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${statusClass}`}>{offer.status}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {incoming ? 'From' : 'To'} {otherParty ? `${otherParty.firstname || ''} ${otherParty.lastname || ''}`.trim() : 'campus member'}
              {' · '}Asking {money(offer.askingPrice)}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Offer {money(offer.offeredPrice)}</span>
              <span className="text-slate-500 dark:text-slate-400">Qty {offer.quantity}</span>
              {offer.counterPrice != null && <span className="font-bold text-amber-700 dark:text-amber-300">Counter {money(offer.counterPrice)}</span>}
            </div>
          </div>
        </div>
        {offer.message && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">{offer.message}</p>}
        {incoming && offer.status === 'pending' && (
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row">
              <button disabled={busyId === offer._id} onClick={() => respond(offer, 'accept')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><FaCheckCircle /> Accept</button>
              <button disabled={busyId === offer._id} onClick={() => respond(offer, 'reject')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 disabled:opacity-50"><FaTimesCircle /> Reject</button>
              <div className="flex min-w-0 flex-1 gap-2">
                <input type="number" min="1" value={counterPrices[offer._id] || ''} onChange={e => setCounterPrices(prev => ({ ...prev, [offer._id]: e.target.value }))} placeholder="Counter price ₹" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                <button disabled={busyId === offer._id} onClick={() => respond(offer, 'counter')} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">Counter</button>
              </div>
            </div>
          </div>
        )}
        {!incoming && offer.status === 'countered' && (
          <button disabled={busyId === offer._id} onClick={() => acceptCounter(offer)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">
            Accept counter at {money(offer.counterPrice)} <FaArrowRight />
          </button>
        )}
        {!incoming && offer.status === 'accepted' && (
          <button disabled={!item._id || item.isActive === false || busyId === offer._id} onClick={() => navigate(`/buy/${item._id}?offerId=${offer._id}&quantity=${offer.quantity}`)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">
            Checkout at agreed price <FaArrowRight />
          </button>
        )}
        {offer.status === 'completed' && <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">This negotiated offer was used for an order.</p>}
      </article>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-2">
      <header className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl"><FaHandshake /></span><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">CampusKart marketplace</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">Offers & bargaining</h1></div></div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-50">Send more than one offer across listings, review buyer offers, and negotiate a price. Accepted offers can be checked out at the agreed price while stock remains available.</p>
      </header>

      {loading ? <div className="flex items-center justify-center gap-3 py-16 text-slate-500"><FaSpinner className="animate-spin" /> Loading offers…</div> : (
        <>
          <section className="space-y-4">
            <div><h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Offers on your listings</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Accept, reject, or send a counter-price to the buyer.</p></div>
            {received.length ? received.map(offer => <OfferCard key={offer._id} offer={offer} incoming />) : <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">No incoming offers yet.</p>}
          </section>
          <section className="space-y-4">
            <div><h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Offers you sent</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track responses and accept seller counter-offers.</p></div>
            {sent.length ? sent.map(offer => <OfferCard key={offer._id} offer={offer} incoming={false} />) : <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">You haven't made any offers. Open a listing and choose “Make an offer”.</p>}
          </section>
        </>
      )}
    </div>
  );
}

export default Offers;
