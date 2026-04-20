import { PersonCardsList } from "@/entities/person";
import { ProfessionsSliderSkeleton } from "@/entities/profession";

import styles from './AllCreatorsViewer.module.scss';


export const AllCreatorsLoader = () => {
    return (
      <div className={styles.content}>
        <ProfessionsSliderSkeleton />

        <div className={styles.personsSection}>
          <PersonCardsList isLoading persons={[]} />
        </div>
      </div>
    );
  }