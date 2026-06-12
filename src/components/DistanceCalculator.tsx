"use client";

import { useState } from "react";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { useLoadScript } from "@react-google-maps/api";
import { Loader2, Map, Calculator, ArrowRight, Car, CheckCircle } from "lucide-react";
import { CityConfig } from "@/lib/db";
import { getTheme } from "@/lib/theme";
import CallButton from "@/components/CallButton";

const LIBRARIES: ("places")[] = ["places"];

interface DistanceCalculatorProps {
    city: CityConfig;
}

export function DistanceCalculator({ city }: DistanceCalculatorProps) {
    const theme = getTheme(city.slug);
    const classes = theme.classes;

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
        libraries: LIBRARIES,
    });

    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [calculating, setCalculating] = useState(false);
    const [result, setResult] = useState<{ distance: string, duration: string, price: number } | null>(null);

    const calculatePrice = async () => {
        if (!pickup || !dropoff) return;
        setCalculating(true);
        setResult(null);

        try {
            const service = new google.maps.DistanceMatrixService();
            const response = await service.getDistanceMatrix({
                origins: [pickup],
                destinations: [dropoff],
                travelMode: google.maps.TravelMode.DRIVING,
            });

            const element = response.rows[0].elements[0];
            if (element.status === "OK") {
                const distanceKm = element.distance.value / 1000;
                // Pricing Formula: ~2.0€/km + 5€ pickup (Avg for long distance)
                // This is an ESTIMATE
                const estimatedPrice = Math.round((distanceKm * 2.0) + 5);

                setResult({
                    distance: element.distance.text,
                    duration: element.duration.text,
                    price: estimatedPrice
                });
            } else {
                alert("Impossible de calculer l'itinéraire.");
            }
        } catch (error) {
            console.error("Error calculating distance", error);
            alert("Erreur de calcul. Vérifiez les adresses.");
        } finally {
            setCalculating(false);
        }
    };

    return (
        <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator size={20} className={theme.classes.text} />
                Estimez votre trajet
            </h3>

            <div className="space-y-4">
                {isLoaded ? (
                    <>
                        <AddressAutocomplete
                            label=""
                            placeholder="Départ (ex: Votre adresse)"
                            value={pickup}
                            onChange={setPickup}
                            onSelect={setPickup}
                            theme={theme}
                            className="[&_input]:bg-neutral-900 [&_input]:border-neutral-700 [&_input]:text-white [&_input]:placeholder-neutral-500"
                        />
                        <AddressAutocomplete
                            label=""
                            placeholder="Destination (ex: Paris, Nice...)"
                            value={dropoff}
                            onChange={setDropoff}
                            onSelect={setDropoff}
                            theme={theme}
                            className="[&_input]:bg-neutral-900 [&_input]:border-neutral-700 [&_input]:text-white [&_input]:placeholder-neutral-500"
                        />
                    </>
                ) : (
                    <div className="text-neutral-500 text-sm">Chargement de la carte...</div>
                )}

                {result && (
                    <div className="bg-neutral-900/80 rounded-xl p-4 border border-white/10 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-neutral-400 text-sm">Distance</span>
                            <span className="text-white font-bold">{result.distance}</span>
                        </div>
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-neutral-400 text-sm">Durée estimée</span>
                            <span className="text-white font-bold">{result.duration}</span>
                        </div>
                        <div className={`p-4 rounded-lg bg-gradient-to-r ${classes.gradientFrom} ${classes.gradientTo} text-neutral-900`}>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Estimation</span>
                                <span className="font-extrabold text-3xl">{result.price} €</span>
                            </div>
                            <p className="text-[10px] opacity-80 mt-1 text-center font-medium uppercase tracking-wider">Prix indicatif soumis à confirmation</p>
                        </div>
                    </div>
                )}

                {!result && (
                    <button
                        onClick={calculatePrice}
                        disabled={calculating || !pickup || !dropoff}
                        className={`w-full py-4 font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${classes.bg} ${theme.text} hover:brightness-110`}
                    >
                        {calculating ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
                        Calculer le prix
                    </button>
                )}

                {result && (
                    <div className="space-y-3">
                        <CallButton
                            phoneNumber={city.phoneNumber}
                            cityName={city.city}
                            theme={theme}
                            className={`block w-full py-4 text-white font-bold rounded-lg transition text-center shadow-lg ${classes.shadow} ${classes.bg} ${classes.bgHover}`}
                        >
                            Réserver ce trajet
                        </CallButton>

                        <button
                            onClick={() => {
                                setPickup("");
                                setDropoff("");
                                setResult(null);
                            }}
                            className="block w-full py-3 bg-neutral-800 text-neutral-400 font-medium rounded-lg hover:bg-neutral-700 transition text-center text-sm"
                        >
                            Faire un autre calcul
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DistanceCalculator;
