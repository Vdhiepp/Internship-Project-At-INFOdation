package intern.team3.obmr.repository;

import intern.team3.obmr.domain.EventMeetings;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the EventMeetings entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventMeetingsRepository extends JpaRepository<EventMeetings, Long> {
    // Lấy danh sách sự kiện theo username
    @Query(value = "SELECT em.* FROM event_meetings em " +
        "JOIN event_users eu ON eu.event_meeting_id = em.id " +
        "WHERE eu.appusers_id = (SELECT id FROM app_users au WHERE au.username = :username)",
        nativeQuery = true)
    List<EventMeetings> findEventsByUsername(@Param("username") String username);
}
