<?php

namespace Database\Factories;

use App\Models\CauseCode;
use App\Models\Department;
use App\Models\Equipment;
use App\Models\FindingClause;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\FindingType;
use App\Models\FunctionalLocation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Finding>
 */
class FindingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $industrialFindings = [
            'Found oil leakage on the main gearbox housing, potential seal failure.',
            'High vibration detected on motor drive end, exceeding 7.1 mm/s threshold.',
            'Corrosion detected on support structure beam C-12, requires immediate painting.',
            'Electrical panel terminal 4 overheated (detected by thermal scan: 85°C).',
            'Abnormal noise (grinding sound) coming from conveyor belt idlers.',
            'Loose mounting bolts on hydraulic pump unit, causing slight misalignment.',
            'Safety guard missing on rotating shaft after previous maintenance activity.',
            'Dust accumulation inside the VFD panel, risk of short circuit.',
            'Cracked foundation base on compressor unit #3, risk of excessive movement.',
            'Pneumatic hose leaking air at 4 bar pressure on the sorting station cylinder.',
            'Emergency stop button on conveyor line 2 is unresponsive during testing.',
            'Worn out brake pads on the overhead crane hoist unit, requires replacement.',
            'Excessive grease buildup on motor bearings, causing high temperature (75°C).',
            'Water ingress detected in the underground cable trench, risk of insulation failure.',
            'Broken pressure gauge on the steam boiler output line, showing static reading.',
            'Scaffolding on site lacks proper base plates and toe boards for safety.',
            'Chiller unit fan motor blades are unbalanced, causing structural vibration.',
            'Clogged air filter on the central HVAC unit, reducing airflow efficiency.',
            'Incorrect bolt grade (Grade 5 instead of 8.8) used on high-torque flanges.',
            'Hydraulic oil level below minimum mark on the injection molding machine.',
            'Missing identification labels on the chemical storage tanks (Area B).',
            'Fire extinguisher in the electrical room has expired (Last service: Oct 2025).',
            'Damaged insulation on the main steam pipe, causing significant heat loss.',
            'Grounding cable disconnected from the secondary transformer neutral point.',
            'Broken limit switch on the automatic gate, causing over-travel issues.',
            'Cooling water pump seal leaking (approx. 10 drops per minute).',
            'Excessive play detected in the coupling assembly of the feed water pump.',
            'PLC battery low warning displayed on the control room HMI.',
            'Uneven belt tension on the ventilator fan drive, causing slippage.',
            'Handrail on the mezzanine floor is loose, structural integrity compromised.'
        ];

        $rectificationActions = [
            'Replaced gearbox input shaft seal and topped up gear oil to required level.',
            'Performed laser alignment and replaced drive-end bearing with SKF Explorer series.',
            'Surface prepared by wire brushing and applied two coats of industrial anti-corrosion paint.',
            'Tightened all terminal connections and replaced damaged lug on phase L2.',
            'Lubricated idler bearings and replaced 3 units of seized rollers on section B.',
            'Re-torqued mounting bolts to 120 Nm and verified alignment using dial indicator.',
            'Fabricated and installed a new safety guard with interlocking sensor.',
            'Cleaned VFD interior using low-pressure dry compressed air and replaced cooling fan.',
            'Applied high-strength epoxy injection to seal foundation cracks and reinforced base.',
            'Cut damaged hose section and installed new high-pressure pneumatic fitting.',
            'Replaced faulty contact block on E-stop button and verified signal to PLC.',
            'Installed new heavy-duty brake pads and adjusted clearance to 0.5 mm.',
            'Cleaned old grease using degreaser and applied correct amount of high-temp lubricant.',
            'Pumped out water and applied waterproof sealant to cable entry points.',
            'Replaced defective pressure gauge with a calibrated 0-16 bar glycerine-filled type.',
            'Installed missing base plates and toe boards as per K3 safety standards.',
            'Balanced fan blades using clip-on weights and verified vibration reduction.',
            'Replaced clogged air filter with a new HEPA-standard filter element.',
            'Replaced all Grade 5 bolts with certified Grade 8.8 high-tensile bolts.',
            'Refilled hydraulic tank to maximum level and inspected for external leaks.',
            'Applied new weather-resistant GHS identification labels on all tanks.',
            'Sent fire extinguisher for hydro-testing and replaced with a newly certified unit.',
            'Removed damaged insulation and installed new rockwool section with aluminum cladding.',
            'Reconnected grounding cable and verified earth resistance is below 5 Ohms.',
            'Adjusted limit switch position and replaced the actuator arm for smooth operation.',
            'Replaced mechanical seal assembly and verified zero leakage during trial run.',
            'Replaced flexible coupling insert and checked for angular misalignment.',
            'Replaced PLC backup battery (CR2032) and cleared the alarm on HMI.',
            'Adjusted ventilator belt tension to 15mm deflection and verified pulley alignment.',
            'Reinforced handrail joints using arc welding and secured anchor bolts to floor.'
        ];

        $type = FindingType::inRandomOrder()->first();
        $randomIndex = $this->faker->numberBetween(0, count($industrialFindings) - 1);
        $description = $industrialFindings[$randomIndex];
        $rectificationAction = $rectificationActions[$randomIndex];
        $findingStatus =  FindingStatus::inRandomOrder()->first();
        $isClosed = strtolower($findingStatus->name) === 'closed';
        $createdAt = $this->faker->dateTimeBetween('-1 month', 'now');

        return [
            'finding_type_id' => $type->id,
            'finding_clause_id' => FindingClause::where('type', $type->code)->inRandomOrder()->first()->id,
            'finding_status_id' => $findingStatus->id,
            'finding_priority_id' => FindingPriority::inRandomOrder()->first()->id,
            'cause_code_id' => $type->code == 'ABN' ? CauseCode::inRandomOrder()->first()->id : null,
            'equipment_id' => Equipment::inRandomOrder()->first()->id ?? Equipment::factory(),
            'functional_location_id' => FunctionalLocation::inRandomOrder()->first()->id ?? FunctionalLocation::factory(),
            'description' => $description,
            'department_id' => Department::inRandomOrder()->first()->id,
            'rectification_action' => $isClosed ? $rectificationAction : null,
            'notification' => $this->faker->numerify('########'),
            'inspected_by' => User::inRandomOrder()->first()->id ?? User::factory()->create()->id,
            'rectified_by' => $isClosed ? User::factory()->create()->id : null,
            'verified_by' => $isClosed ? User::factory()->create()->id : null,
            'created_at' => $createdAt,
            'closed_at' => $isClosed ? $this->faker->dateTimeBetween($createdAt, '+1 month') : null,
        ];
    }
}
