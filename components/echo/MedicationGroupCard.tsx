'use client';
import React from 'react';
import { Medication, MedicationGroup } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import { Edit2, Trash2, CheckSquare, Package, ChevronDown, ChevronUp } from 'lucide-react';

interface MedicationGroupCardProps {
  group: MedicationGroup;
  medications: Medication[]; // All medications to look up names from IDs
  onLogBundle: (groupId: string) => void;
  onEdit: (group: MedicationGroup) => void;
  onDelete: (groupId: string) => void;
}

const MedicationGroupCard: React.FC<MedicationGroupCardProps> = ({ 
  group, 
  medications, 
  onLogBundle, 
  onEdit, 
  onDelete 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const medicationsInGroup = group.medicationIds.map(id => 
    medications.find(med => med.id === id)
  ).filter(Boolean) as Medication[]; // Filter out undefined if a med was deleted but still in group

  return (
    <div className="bg-surface-container-low shadow-lg rounded-xl p-5 sm:p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <Package className="w-6 h-6 text-secondary" />
          <h3 className="font-serif text-title-lg text-surface-on">{group.name}</h3>
          <span className="text-sm text-surface-on-variant">({medicationsInGroup.length} meds)</span>
        </div>
        <div className="flex space-x-1">
          <ActionButton
            variant="text"
            size="sm"
            isIconOnly
            title="Edit Bundle"
            onClick={() => onEdit(group)}
            aria-label={`Edit bundle ${group.name}`}
          >
            <Edit2 className="w-5 h-5" />
          </ActionButton>
          <ActionButton
            variant="text"
            size="sm"
            isIconOnly
            title="Delete Bundle"
            onClick={() => onDelete(group.id)}
            aria-label={`Delete bundle ${group.name}`}
            className="text-error hover:bg-error-container/20"
          >
            <Trash2 className="w-5 h-5" />
          </ActionButton>
        </div>
      </div>

      {medicationsInGroup.length > 0 && (
        <div className="mb-4">
          <ActionButton
            onClick={() => setIsExpanded(!isExpanded)}
            variant="text"
            size="sm"
            className="text-xs text-surface-on-variant"
            trailingIcon={isExpanded ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
            aria-expanded={isExpanded}
            aria-controls={`bundle-meds-${group.id}`}
          >
            {isExpanded ? 'Hide Medications' : 'Show Medications'}
          </ActionButton>
          {isExpanded && (
            <ul id={`bundle-meds-${group.id}`} className="list-disc list-inside mt-2 pl-4 space-y-1 text-sm text-surface-on-variant">
              {medicationsInGroup.map(med => (
                <li key={med.id}>{med.name} ({med.dosage})</li>
              ))}
            </ul>
          )}
        </div>
      )}
       {medicationsInGroup.length === 0 && (
         <p className="text-sm text-surface-on-variant italic mb-3">
            This bundle is empty. Edit to add medications.
         </p>
       )}


      <ActionButton
        variant="filled"
        size="md"
        leadingIcon={<CheckSquare className="w-5 h-5" />}
        onClick={() => onLogBundle(group.id)}
        className="w-full"
        aria-label={`Log all medications in bundle ${group.name} as taken`}
        disabled={medicationsInGroup.length === 0}
      >
        Log All in Bundle Taken
      </ActionButton>
    </div>
  );
};

export default MedicationGroupCard;
